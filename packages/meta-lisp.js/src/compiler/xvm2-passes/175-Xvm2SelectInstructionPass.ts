import * as B from "../../basic/index.ts"
import * as Xvm2 from "../../xvm2/index.ts"

export function Xvm2SelectInstructionPass(program: B.Program): Xvm2.Program {
  const xvm2Program = Xvm2.createProgram()

  for (const [name, definition] of program.definitions) {
    switch (definition.kind) {
      case "FunctionDefinition": {
        const instrs = codegenFunction(program, definition)
        xvm2Program.definitions.set(
          name,
          Xvm2.FunctionDefinition(name, definition.parameters, instrs),
        )
        break
      }

      case "VariableDefinition": {
        xvm2Program.definitions.set(name, Xvm2.VariableDeclaration(name))
        break
      }

      case "ExternFunctionDefinition": {
        xvm2Program.definitions.set(
          name,
          Xvm2.PrimitiveFunctionDeclaration(name),
        )
        break
      }

      case "ExternVariableDefinition": {
        xvm2Program.definitions.set(
          name,
          Xvm2.PrimitiveVariableDeclaration(name),
        )
        break
      }
    }
  }

  return xvm2Program
}

function codegenFunction(
  program: B.Program,
  definition: B.FunctionDefinition,
): Array<Xvm2.Instr> {
  const instrs: Array<Xvm2.Instr> = []

  for (const block of definition.blocks.values()) {
    instrs.push(Xvm2.Instr("label", [Xvm2.VarOperand(block.label)]))

    for (const instr of block.instrs) {
      for (const generated of codegenInstr(program, instr)) {
        instrs.push(generated)
      }
    }
  }

  return instrs
}

function isPrimitiveFunction(program: B.Program, name: string): boolean {
  const definition = B.programLookupDefinition(program, name)
  return definition?.kind === "ExternFunctionDefinition"
}

function codegenInstr(program: B.Program, instr: B.Instr): Array<Xvm2.Instr> {
  switch (instr.op) {
    case "argument": {
      return []
    }

    case "int": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const value = B.expectInt(instr.attributes, "content")
      return [Xvm2.Instr("load", [dest, Xvm2.IntOperand(value)])]
    }

    case "float": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const value = B.expectFloat(instr.attributes, "content")
      return [Xvm2.Instr("load", [dest, Xvm2.FloatOperand(value)])]
    }

    case "symbol": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const content = B.expectSymbol(instr.attributes, "content")
      return [Xvm2.Instr("load", [dest, Xvm2.SymbolOperand(content)])]
    }

    case "text": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const content = B.expectString(instr.attributes, "content")
      return [Xvm2.Instr("load", [dest, Xvm2.StringOperand(content)])]
    }

    case "copy": {
      const src = Xvm2.VarOperand(instr.input[0].id)
      const dest = Xvm2.VarOperand(instr.output[0].id)
      return [Xvm2.Instr("move", [dest, src])]
    }

    case "provide": {
      const src = Xvm2.VarOperand(instr.input[0].id)
      const useSite = B.expectSymbol(instr.attributes, "use-site")
      const dest = Xvm2.VarOperand(useSite)
      return [Xvm2.Instr("move", [dest, src])]
    }

    case "use": {
      return []
    }

    case "ref": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      if (isPrimitiveFunction(program, name)) {
        return [Xvm2.Instr("load", [dest, Xvm2.PrimOperand(name)])]
      }
      return [Xvm2.Instr("load", [dest, Xvm2.FnOperand(name)])]
    }

    case "global-load": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm2.Instr("global-load", [dest, Xvm2.GlobalOperand(name)])]
    }

    case "global-store": {
      const src = Xvm2.VarOperand(instr.input[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm2.Instr("global-store", [Xvm2.GlobalOperand(name), src])]
    }

    case "call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((cell) => Xvm2.VarOperand(cell.id))
      const isPrim = isPrimitiveFunction(program, name)
      const op = isPrim ? `call-prim-${args.length}` : `call-${args.length}`
      const result: Array<Xvm2.Instr> = [
        Xvm2.Instr(op, [
          isPrim ? Xvm2.PrimOperand(name) : Xvm2.FnOperand(name),
          ...args,
        ]),
      ]
      if (instr.output.length > 0) {
        const dest = Xvm2.VarOperand(instr.output[0].id)
        result.push(Xvm2.Instr("load-result", [dest]))
      }
      return result
    }

    case "tail-call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((cell) => Xvm2.VarOperand(cell.id))
      const isPrim = isPrimitiveFunction(program, name)
      const op = isPrim
        ? `tail-call-prim-${args.length}`
        : `tail-call-${args.length}`
      return [
        Xvm2.Instr(op, [
          isPrim ? Xvm2.PrimOperand(name) : Xvm2.FnOperand(name),
          ...args,
        ]),
      ]
    }

    case "apply": {
      const [target, ...argCells] = instr.input
      const targetVar = Xvm2.VarOperand(target.id)
      const args = argCells.map((cell) => Xvm2.VarOperand(cell.id))
      const result: Array<Xvm2.Instr> = [
        Xvm2.Instr(`apply-${args.length}`, [targetVar, ...args]),
      ]
      if (instr.output.length > 0) {
        const dest = Xvm2.VarOperand(instr.output[0].id)
        result.push(Xvm2.Instr("load-result", [dest]))
      }
      return result
    }

    case "tail-apply": {
      const [target, ...argCells] = instr.input
      const targetVar = Xvm2.VarOperand(target.id)
      const args = argCells.map((cell) => Xvm2.VarOperand(cell.id))
      return [Xvm2.Instr(`tail-apply-${args.length}`, [targetVar, ...args])]
    }

    case "branch": {
      const cond = Xvm2.VarOperand(instr.input[0].id)
      const thenLabel = B.expectSymbol(instr.attributes, "then-label")
      const elseLabel = B.expectSymbol(instr.attributes, "else-label")
      return [
        Xvm2.Instr("branch", [
          cond,
          Xvm2.LabelOperand(thenLabel),
          Xvm2.LabelOperand(elseLabel),
        ]),
      ]
    }

    case "goto": {
      const label = B.expectSymbol(instr.attributes, "label")
      return [Xvm2.Instr("goto", [Xvm2.LabelOperand(label)])]
    }

    case "return": {
      if (instr.input.length === 0) {
        return [Xvm2.Instr("return-void", [])]
      }
      const src = Xvm2.VarOperand(instr.input[0].id)
      return [Xvm2.Instr("return", [src])]
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
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const a = Xvm2.VarOperand(instr.input[0].id)
      const b = Xvm2.VarOperand(instr.input[1].id)
      return [Xvm2.Instr(instr.op, [dest, a, b])]
    }

    case "ineg":
    case "int-is-positive":
    case "int-is-non-negative":
    case "int-is-non-zero": {
      const dest = Xvm2.VarOperand(instr.output[0].id)
      const src = Xvm2.VarOperand(instr.input[0].id)
      return [Xvm2.Instr(instr.op, [dest, src])]
    }

    default: {
      let message = `[Xvm2SelectInstructionPass] unhandled instr op: ${instr.op}`
      throw new Error(message)
    }
  }
}
