import * as B from "@xieyuheng/basic-lisp.js"
import * as Xvm from "@xieyuheng/xvm-lisp.js"
import { allocatingPrimitivesEn } from "./allocating-primitives-en.ts"
import { allocatingPrimitivesZh } from "./allocating-primitives-zh.ts"

export function SelectInstructionPass(program: B.Program): Xvm.Program {
  const xvmProgram = Xvm.createProgram()

  for (const [name, definition] of program.definitions) {
    switch (definition.kind) {
      case "FunctionDefinition": {
        const instrs = codegenFunction(program, definition)
        xvmProgram.definitions.set(
          name,
          Xvm.FunctionDefinition(name, definition.parameters, instrs),
        )
        break
      }

      case "VariableDefinition": {
        xvmProgram.definitions.set(name, Xvm.VariableDeclaration(name))
        break
      }

      case "ExternFunctionDefinition": {
        xvmProgram.definitions.set(name, Xvm.PrimitiveFunctionDeclaration(name))
        break
      }

      case "ExternVariableDefinition": {
        xvmProgram.definitions.set(name, Xvm.PrimitiveVariableDeclaration(name))
        break
      }
    }
  }

  return xvmProgram
}

function codegenFunction(
  program: B.Program,
  definition: B.FunctionDefinition,
): Array<Xvm.Instr> {
  const instrs: Array<Xvm.Instr> = []

  for (const block of definition.blocks.values()) {
    instrs.push(Xvm.Instr("label", [Xvm.VarOperand(block.label)]))

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

// - match against the last segment of a qualified name,
//   so that one entry covers both the `builtin` and the `内置` namespaces.
function isAllocatingPrimitive(name: string): boolean {
  const shortName = name.split("/").pop() ?? name
  return (
    allocatingPrimitivesEn.has(shortName) ||
    allocatingPrimitivesZh.has(shortName)
  )
}

function codegenInstr(program: B.Program, instr: B.Instr): Array<Xvm.Instr> {
  switch (instr.op) {
    case "argument": {
      return []
    }

    case "int": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const value = B.expectInt(instr.attributes, "content")
      return [Xvm.Instr("load-int", [dest, Xvm.IntOperand(value)])]
    }

    case "float": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const value = B.expectFloat(instr.attributes, "content")
      return [Xvm.Instr("load-float", [dest, Xvm.FloatOperand(value)])]
    }

    case "symbol": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const content = B.expectSymbol(instr.attributes, "content")
      return [Xvm.Instr("load-symbol", [dest, Xvm.SymbolOperand(content)])]
    }

    case "text": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const content = B.expectString(instr.attributes, "content")
      return [Xvm.Instr("load-string", [dest, Xvm.StringOperand(content)])]
    }

    case "copy": {
      const src = Xvm.VarOperand(instr.input[0].id)
      const dest = Xvm.VarOperand(instr.output[0].id)
      return [Xvm.Instr("move", [dest, src])]
    }

    case "provide": {
      const src = Xvm.VarOperand(instr.input[0].id)
      const useSite = B.expectSymbol(instr.attributes, "use-site")
      const dest = Xvm.VarOperand(useSite)
      return [Xvm.Instr("move", [dest, src])]
    }

    case "use": {
      return []
    }

    case "load-closure": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm.Instr("load-closure", [dest, Xvm.FnOperand(name)])]
    }

    case "make-closure": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      const size = B.expectInt(instr.attributes, "size")
      // make-closure always allocates a new closure object.
      return [
        Xvm.Instr("gc", []),
        Xvm.Instr("make-closure", [
          dest,
          Xvm.FnOperand(name),
          Xvm.U16Operand(Number(size)),
        ]),
      ]
    }

    case "store-closure-arg": {
      const closure = Xvm.VarOperand(instr.input[0].id)
      const value = Xvm.VarOperand(instr.input[1].id)
      const index = B.expectInt(instr.attributes, "index")
      return [
        Xvm.Instr("store-closure-arg", [
          closure,
          Xvm.U16Operand(Number(index)),
          value,
        ]),
      ]
    }

    case "global-load": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm.Instr("load-global", [dest, Xvm.GlobalOperand(name)])]
    }

    case "global-store": {
      const src = Xvm.VarOperand(instr.input[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm.Instr("store-global", [Xvm.GlobalOperand(name), src])]
    }

    case "call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((cell) => Xvm.VarOperand(cell.id))
      const isPrim = isPrimitiveFunction(program, name)
      const op = isPrim ? `call-prim-${args.length}` : `call-${args.length}`
      const result: Array<Xvm.Instr> = []
      // a prim call may allocate inside the C implementation, which the
      // compiler cannot see, so check before the call at an instruction
      // boundary, where all live values are in the frame locals.
      if (isPrim && isAllocatingPrimitive(name)) {
        result.push(Xvm.Instr("gc", []))
      }
      result.push(
        Xvm.Instr(op, [
          isPrim ? Xvm.PrimOperand(name) : Xvm.FnOperand(name),
          ...args,
        ]),
      )
      if (instr.output.length > 0) {
        const dest = Xvm.VarOperand(instr.output[0].id)
        result.push(Xvm.Instr("load-result", [dest]))
      }
      return result
    }

    case "tail-call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((cell) => Xvm.VarOperand(cell.id))
      const isPrim = isPrimitiveFunction(program, name)
      const op = isPrim
        ? `tail-call-prim-${args.length}`
        : `tail-call-${args.length}`
      const call = Xvm.Instr(op, [
        isPrim ? Xvm.PrimOperand(name) : Xvm.FnOperand(name),
        ...args,
      ])
      // a tail call never returns to pop the frame, so a gc check must
      // happen before the call.
      if (isPrim && isAllocatingPrimitive(name)) {
        return [Xvm.Instr("gc", []), call]
      }
      return [call]
    }

    case "apply": {
      const [target, ...argCells] = instr.input
      const targetVar = Xvm.VarOperand(target.id)
      const args = argCells.map((cell) => Xvm.VarOperand(cell.id))
      const result: Array<Xvm.Instr> = [
        Xvm.Instr(`apply-${args.length}`, [targetVar, ...args]),
      ]
      if (instr.output.length > 0) {
        const dest = Xvm.VarOperand(instr.output[0].id)
        result.push(Xvm.Instr("load-result", [dest]))
      }
      return result
    }

    case "tail-apply": {
      const [target, ...argCells] = instr.input
      const targetVar = Xvm.VarOperand(target.id)
      const args = argCells.map((cell) => Xvm.VarOperand(cell.id))
      return [Xvm.Instr(`tail-apply-${args.length}`, [targetVar, ...args])]
    }

    case "branch": {
      const cond = Xvm.VarOperand(instr.input[0].id)
      const thenLabel = B.expectSymbol(instr.attributes, "then-label")
      const elseLabel = B.expectSymbol(instr.attributes, "else-label")
      return [
        Xvm.Instr("branch", [
          cond,
          Xvm.LabelOperand(thenLabel),
          Xvm.LabelOperand(elseLabel),
        ]),
      ]
    }

    case "goto": {
      const label = B.expectSymbol(instr.attributes, "label")
      return [Xvm.Instr("goto", [Xvm.LabelOperand(label)])]
    }

    case "return": {
      if (instr.input.length === 0) {
        return [Xvm.Instr("return-void", [])]
      }
      const src = Xvm.VarOperand(instr.input[0].id)
      return [Xvm.Instr("return", [src])]
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
      const dest = Xvm.VarOperand(instr.output[0].id)
      const a = Xvm.VarOperand(instr.input[0].id)
      const b = Xvm.VarOperand(instr.input[1].id)
      return [Xvm.Instr(instr.op, [dest, a, b])]
    }

    case "ineg":
    case "int-is-positive":
    case "int-is-non-negative":
    case "int-is-non-zero": {
      const dest = Xvm.VarOperand(instr.output[0].id)
      const src = Xvm.VarOperand(instr.input[0].id)
      return [Xvm.Instr(instr.op, [dest, src])]
    }

    default: {
      let message = `[SelectInstructionPass] unhandled instr op: ${instr.op}`
      throw new Error(message)
    }
  }
}
