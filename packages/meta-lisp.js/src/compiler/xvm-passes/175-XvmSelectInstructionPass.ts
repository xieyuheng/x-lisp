import * as B from "../../basic/index.ts"
import * as Xvm from "../../xvm/index.ts"
import { type XvmExplicateReport } from "./170-XvmExplicateControlPass.ts"

export function XvmSelectInstructionPass(
  result: XvmExplicateReport,
): Xvm.Program {
  const xvmProgram = Xvm.createProgram()

  for (const [name, definition] of result.program.definitions) {
    if (definition.kind !== "FunctionDefinition") continue

    const { arity, instrs } = codegenFunction(definition)

    if (result.variableNames.has(name)) {
      xvmProgram.definitions.set(name, Xvm.VariableDefinition(name, instrs))
    } else if (result.testNames.has(name)) {
      xvmProgram.definitions.set(name, Xvm.TestDefinition(name, instrs))
    } else {
      xvmProgram.definitions.set(
        name,
        Xvm.FunctionDefinition(name, arity, instrs),
      )
    }
  }

  for (const [name, arity] of result.primitiveFunctions) {
    xvmProgram.definitions.set(
      name,
      Xvm.PrimitiveFunctionDeclaration(name, arity),
    )
  }

  for (const name of result.primitiveVariables) {
    xvmProgram.definitions.set(name, Xvm.PrimitiveVariableDeclaration(name))
  }

  return xvmProgram
}

type CodegenState = {
  cellIndexes: Map<string, number>
}

function allocateRegisters(definition: B.FunctionDefinition): {
  cellIndexes: Map<string, number>
  arity: number
} {
  const cellIndexes = new Map<string, number>()
  let arity = 0
  let nextIndex = 0

  for (const block of definition.blocks.values()) {
    for (const instr of block.instrs) {
      if (instr.op === "argument") {
        const index = Number(B.expectInt(instr.attributes, "index"))
        cellIndexes.set(instr.output[0].id, index)
        if (index + 1 > arity) arity = index + 1
        if (index + 1 > nextIndex) nextIndex = index + 1
      }
    }
  }

  const allCellIds = new Set<string>()
  for (const block of definition.blocks.values()) {
    for (const instr of block.instrs) {
      for (const cell of instr.output) {
        allCellIds.add(cell.id)
      }
      if (instr.op === "provide") {
        const useSite = B.expectSymbol(instr.attributes, "use-site")
        allCellIds.add(useSite)
      }
    }
  }

  for (const cellId of allCellIds) {
    if (!cellIndexes.has(cellId)) {
      cellIndexes.set(cellId, nextIndex)
      nextIndex++
    }
  }

  return { cellIndexes, arity }
}

function lookupIndex(state: CodegenState, cellId: string): number {
  const index = state.cellIndexes.get(cellId)
  if (index === undefined) {
    throw new Error(`[lookupIndex] unknown cell: ${cellId}`)
  }
  return index
}

function intOp(n: number): Xvm.IntOperand {
  return Xvm.IntOperand(BigInt(n))
}

function codegenFunction(definition: B.FunctionDefinition): {
  arity: number
  instrs: Array<Xvm.Instr>
} {
  const { cellIndexes, arity } = allocateRegisters(definition)
  const state: CodegenState = { cellIndexes }

  const instrs: Array<Xvm.Instr> = []

  for (const block of definition.blocks.values()) {
    instrs.push(Xvm.Instr("label", [Xvm.VarOperand(block.label)]))

    for (const instr of block.instrs) {
      const generated = codegenInstr(state, instr)
      for (const gi of generated) instrs.push(gi)
    }
  }

  return { arity, instrs }
}

function codegenInstr(state: CodegenState, instr: B.Instr): Array<Xvm.Instr> {
  switch (instr.op) {
    case "argument": {
      return []
    }

    case "int": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const value = B.expectInt(instr.attributes, "content")
      return [Xvm.Instr("load", [intOp(destIdx), Xvm.IntOperand(value)])]
    }

    case "float": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const value = B.expectFloat(instr.attributes, "content")
      return [Xvm.Instr("load", [intOp(destIdx), Xvm.FloatOperand(value)])]
    }

    case "symbol": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const content = B.expectSymbol(instr.attributes, "content")
      return [Xvm.Instr("load", [intOp(destIdx), Xvm.SymbolOperand(content)])]
    }

    case "text": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const content = B.expectString(instr.attributes, "content")
      return [Xvm.Instr("load", [intOp(destIdx), Xvm.StringOperand(content)])]
    }

    case "copy": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      const destIdx = lookupIndex(state, instr.output[0].id)
      if (srcIdx !== destIdx) {
        return [Xvm.Instr("move", [intOp(destIdx), intOp(srcIdx)])]
      }
      return []
    }

    case "provide": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      const useSite = B.expectSymbol(instr.attributes, "use-site")
      const useSiteIdx = lookupIndex(state, useSite)
      if (srcIdx !== useSiteIdx) {
        return [Xvm.Instr("move", [intOp(useSiteIdx), intOp(srcIdx)])]
      }
      return []
    }

    case "use": {
      return []
    }

    case "ref": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm.Instr("ref", [intOp(destIdx), Xvm.VarOperand(name)])]
    }

    case "global-load": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm.Instr("global-load", [intOp(destIdx), Xvm.VarOperand(name)])]
    }

    case "global-store": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [Xvm.Instr("global-store", [intOp(srcIdx), Xvm.VarOperand(name)])]
    }

    case "call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((c) => intOp(lookupIndex(state, c.id)))
      const result: Array<Xvm.Instr> = [
        Xvm.Instr("call", [Xvm.VarOperand(name), ...args]),
      ]
      if (instr.output.length > 0) {
        const destIdx = lookupIndex(state, instr.output[0].id)
        result.push(Xvm.Instr("load-result", [intOp(destIdx)]))
      }
      return result
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
      const destIdx = lookupIndex(state, instr.output[0].id)
      const src1Idx = lookupIndex(state, instr.input[0].id)
      const src2Idx = lookupIndex(state, instr.input[1].id)
      return [
        Xvm.Instr(instr.op, [intOp(destIdx), intOp(src1Idx), intOp(src2Idx)]),
      ]
    }

    case "ineg":
    case "int-is-positive":
    case "int-is-non-negative":
    case "int-is-non-zero": {
      const destIdx = lookupIndex(state, instr.output[0].id)
      const srcIdx = lookupIndex(state, instr.input[0].id)
      return [Xvm.Instr(instr.op, [intOp(destIdx), intOp(srcIdx)])]
    }

    case "tail-call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((c) => intOp(lookupIndex(state, c.id)))
      return [Xvm.Instr("tail-call", [Xvm.VarOperand(name), ...args])]
    }

    case "apply": {
      const targetIdx = lookupIndex(state, instr.input[0].id)
      const args = instr.input
        .slice(1)
        .map((c) => intOp(lookupIndex(state, c.id)))
      const result: Array<Xvm.Instr> = [
        Xvm.Instr("apply", [intOp(targetIdx), ...args]),
      ]
      if (instr.output.length > 0) {
        const destIdx = lookupIndex(state, instr.output[0].id)
        result.push(Xvm.Instr("load-result", [intOp(destIdx)]))
      }
      return result
    }

    case "tail-apply": {
      const targetIdx = lookupIndex(state, instr.input[0].id)
      const args = instr.input
        .slice(1)
        .map((c) => intOp(lookupIndex(state, c.id)))
      return [Xvm.Instr("tail-apply", [intOp(targetIdx), ...args])]
    }

    case "branch": {
      const condIdx = lookupIndex(state, instr.input[0].id)
      const thenLabel = B.expectSymbol(instr.attributes, "then-label")
      const elseLabel = B.expectSymbol(instr.attributes, "else-label")
      return [
        Xvm.Instr("jump-if-not", [intOp(condIdx), Xvm.VarOperand(elseLabel)]),
        Xvm.Instr("jump", [Xvm.VarOperand(thenLabel)]),
      ]
    }

    case "goto": {
      const label = B.expectSymbol(instr.attributes, "label")
      return [Xvm.Instr("jump", [Xvm.VarOperand(label)])]
    }

    case "return": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      return [Xvm.Instr("return", [intOp(srcIdx)])]
    }

    default: {
      let message = `[codegenInstr] unhandled instr op: ${instr.op}`
      console.error(message)
      return []
    }
  }
}
