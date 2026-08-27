import * as B from "../../basic/index.ts"
import * as X2 from "../../xvm2/index.ts"

export function Xvm2CodegenPass(mod: B.Mod): X2.Mod {
  const x2Mod = X2.createMod()

  for (const [name, definition] of mod.definitions) {
    switch (definition.kind) {
      case "FunctionDefinition": {
        const instrs = codegenFunction(mod, definition)
        x2Mod.definitions.set(
          name,
          X2.FunctionDefinition(name, definition.parameters, instrs),
        )
        break
      }

      case "VariableDefinition": {
        x2Mod.definitions.set(name, X2.VariableDeclaration(name))
        break
      }

      case "ExternFunctionDefinition": {
        x2Mod.definitions.set(name, X2.PrimitiveFunctionDeclaration(name))
        break
      }

      case "ExternVariableDefinition": {
        x2Mod.definitions.set(name, X2.PrimitiveVariableDeclaration(name))
        break
      }
    }
  }

  return x2Mod
}

function codegenFunction(
  mod: B.Mod,
  definition: B.FunctionDefinition,
): Array<X2.Instr> {
  const instrs: Array<X2.Instr> = []

  for (const block of definition.blocks.values()) {
    instrs.push(X2.Instr("label", [X2.VarOperand(block.label)]))

    for (const instr of block.instrs) {
      for (const generated of codegenInstr(mod, instr)) {
        instrs.push(generated)
      }
    }
  }

  return instrs
}

function isPrimitiveFunction(mod: B.Mod, name: string): boolean {
  const definition = B.modLookupDefinition(mod, name)
  return definition?.kind === "ExternFunctionDefinition"
}

function codegenInstr(mod: B.Mod, instr: B.Instr): Array<X2.Instr> {
  switch (instr.op) {
    case "argument": {
      return []
    }

    case "int": {
      const dest = X2.VarOperand(instr.output[0].id)
      const value = B.expectInt(instr.attributes, "content")
      return [X2.Instr("load", [dest, X2.IntOperand(value)])]
    }

    case "float": {
      const dest = X2.VarOperand(instr.output[0].id)
      const value = B.expectFloat(instr.attributes, "content")
      return [X2.Instr("load", [dest, X2.FloatOperand(value)])]
    }

    case "symbol": {
      const dest = X2.VarOperand(instr.output[0].id)
      const content = B.expectSymbol(instr.attributes, "content")
      return [X2.Instr("load", [dest, X2.SymbolOperand(content)])]
    }

    case "text": {
      const dest = X2.VarOperand(instr.output[0].id)
      const content = B.expectString(instr.attributes, "content")
      return [X2.Instr("load", [dest, X2.StringOperand(content)])]
    }

    case "copy": {
      const src = X2.VarOperand(instr.input[0].id)
      const dest = X2.VarOperand(instr.output[0].id)
      return [X2.Instr("move", [dest, src])]
    }

    case "provide": {
      const src = X2.VarOperand(instr.input[0].id)
      const useSite = B.expectSymbol(instr.attributes, "use-site")
      const dest = X2.VarOperand(useSite)
      return [X2.Instr("move", [dest, src])]
    }

    case "use": {
      return []
    }

    case "ref": {
      const dest = X2.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      if (isPrimitiveFunction(mod, name)) {
        return [X2.Instr("load", [dest, X2.PrimOperand(name)])]
      }
      return [X2.Instr("load", [dest, X2.FnOperand(name)])]
    }

    case "global-load": {
      const dest = X2.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [X2.Instr("global-load", [dest, X2.GlobalOperand(name)])]
    }

    case "global-store": {
      const src = X2.VarOperand(instr.input[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [X2.Instr("global-store", [X2.GlobalOperand(name), src])]
    }

    case "call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((cell) => X2.VarOperand(cell.id))
      const isPrim = isPrimitiveFunction(mod, name)
      const op = `call-${args.length}`
      const result: Array<X2.Instr> = [
        X2.Instr(op, [
          isPrim ? X2.PrimOperand(name) : X2.FnOperand(name),
          ...args,
        ]),
      ]
      if (instr.output.length > 0) {
        const dest = X2.VarOperand(instr.output[0].id)
        result.push(X2.Instr("load-result", [dest]))
      }
      return result
    }

    case "tail-call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((cell) => X2.VarOperand(cell.id))
      const isPrim = isPrimitiveFunction(mod, name)
      const op = `tail-call-${args.length}`
      return [
        X2.Instr(op, [
          isPrim ? X2.PrimOperand(name) : X2.FnOperand(name),
          ...args,
        ]),
      ]
    }

    case "apply": {
      const [target, ...argCells] = instr.input
      const targetVar = X2.VarOperand(target.id)
      const args = argCells.map((cell) => X2.VarOperand(cell.id))
      const result: Array<X2.Instr> = [
        X2.Instr(`apply-${args.length}`, [targetVar, ...args]),
      ]
      if (instr.output.length > 0) {
        const dest = X2.VarOperand(instr.output[0].id)
        result.push(X2.Instr("load-result", [dest]))
      }
      return result
    }

    case "tail-apply": {
      const [target, ...argCells] = instr.input
      const targetVar = X2.VarOperand(target.id)
      const args = argCells.map((cell) => X2.VarOperand(cell.id))
      return [X2.Instr(`tail-apply-${args.length}`, [targetVar, ...args])]
    }

    case "branch": {
      const cond = X2.VarOperand(instr.input[0].id)
      const thenLabel = B.expectSymbol(instr.attributes, "then-label")
      const elseLabel = B.expectSymbol(instr.attributes, "else-label")
      return [
        X2.Instr("branch", [
          cond,
          X2.LabelOperand(thenLabel),
          X2.LabelOperand(elseLabel),
        ]),
      ]
    }

    case "goto": {
      const label = B.expectSymbol(instr.attributes, "label")
      return [X2.Instr("goto", [X2.LabelOperand(label)])]
    }

    case "return": {
      if (instr.input.length === 0) {
        return [X2.Instr("return-void", [])]
      }
      const src = X2.VarOperand(instr.input[0].id)
      return [X2.Instr("return", [src])]
    }

    case "iadd":
    case "isub":
    case "imul":
    case "idiv":
    case "imod":
    case "int-greater":
    case "int-less":
    case "int-greater-or-equal":
    case "int-less-or-equal": {
      const dest = X2.VarOperand(instr.output[0].id)
      const a = X2.VarOperand(instr.input[0].id)
      const b = X2.VarOperand(instr.input[1].id)
      return [X2.Instr(instr.op, [dest, a, b])]
    }

    case "ineg":
    case "int-is-positive":
    case "int-is-non-negative":
    case "int-is-non-zero": {
      const dest = X2.VarOperand(instr.output[0].id)
      const src = X2.VarOperand(instr.input[0].id)
      return [X2.Instr(instr.op, [dest, src])]
    }

    default: {
      let message = `[Xvm2CodegenPass] unhandled instr op: ${instr.op}`
      throw new Error(message)
    }
  }
}
