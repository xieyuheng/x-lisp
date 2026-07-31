import { zeroLocation } from "@xieyuheng/sexp.js"
import * as B from "../basic2/index.ts"
import * as Xvm from "../xvm/index.ts"
import { type XvmExplicateReport } from "./170-XvmExplicateControlPass.ts"

export function XvmCodegenPass(result: XvmExplicateReport): Xvm.Mod {
  const xvmMod = Xvm.createMod()
  const loc = zeroLocation("codegen")

  for (const [name, definition] of result.mod.definitions) {
    if (definition.kind !== "FunctionDefinition") continue

    const { arity, instrs } = codegenFunction(definition)

    if (result.variableNames.has(name)) {
      xvmMod.definitions.set(name, Xvm.VariableDefinition(name, instrs, loc))
    } else if (result.testNames.has(name)) {
      xvmMod.definitions.set(name, Xvm.TestDefinition(name, instrs, loc))
    } else {
      xvmMod.definitions.set(
        name,
        Xvm.FunctionDefinition(name, arity, instrs, loc),
      )
    }
  }

  for (const [name, arity] of result.primitiveFunctions) {
    xvmMod.definitions.set(
      name,
      Xvm.PrimitiveFunctionDeclaration(name, arity, loc),
    )
  }

  for (const name of result.primitiveVariables) {
    xvmMod.definitions.set(name, Xvm.PrimitiveVariableDeclaration(name, loc))
  }

  return xvmMod
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

function toIntOp(n: number): Xvm.IntOperand {
  return Xvm.IntOperand(BigInt(n), zeroLocation("codegen"))
}

function codegenFunction(definition: B.FunctionDefinition): {
  arity: number
  instrs: Array<Xvm.Instr>
} {
  const { cellIndexes, arity } = allocateRegisters(definition)
  const state: CodegenState = { cellIndexes }
  const loc = zeroLocation("codegen")

  const instrs: Array<Xvm.Instr> = []

  for (const block of definition.blocks.values()) {
    instrs.push(Xvm.Instr("label", [Xvm.VarOperand(block.label, loc)], loc))

    for (const instr of block.instrs) {
      const generated = codegenInstr(state, instr, loc)
      for (const gi of generated) instrs.push(gi)
    }
  }

  return { arity, instrs }
}

function codegenInstr(
  state: CodegenState,
  instr: B.Instr,
  loc: ReturnType<typeof zeroLocation>,
): Array<Xvm.Instr> {
  switch (instr.op) {
    case "argument": {
      return []
    }

    case "int": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const value = B.expectInt(instr.attributes, "content")
      return [
        Xvm.Instr("load", [toIntOp(dstIdx), Xvm.IntOperand(value, loc)], loc),
      ]
    }

    case "float": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const value = B.expectFloat(instr.attributes, "content")
      return [
        Xvm.Instr("load", [toIntOp(dstIdx), Xvm.FloatOperand(value, loc)], loc),
      ]
    }

    case "symbol": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const content = B.expectSymbol(instr.attributes, "content")
      return [
        Xvm.Instr(
          "load",
          [toIntOp(dstIdx), Xvm.SymbolOperand(content, loc)],
          loc,
        ),
      ]
    }

    case "keyword": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const content = B.expectSymbol(instr.attributes, "content")
      return [
        Xvm.Instr(
          "load",
          [toIntOp(dstIdx), Xvm.KeywordOperand(content, loc)],
          loc,
        ),
      ]
    }

    case "string": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const content = B.expectString(instr.attributes, "content")
      return [
        Xvm.Instr(
          "load",
          [toIntOp(dstIdx), Xvm.StringOperand(content, loc)],
          loc,
        ),
      ]
    }

    case "copy": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      const dstIdx = lookupIndex(state, instr.output[0].id)
      if (srcIdx !== dstIdx) {
        return [Xvm.Instr("move", [toIntOp(dstIdx), toIntOp(srcIdx)], loc)]
      }
      return []
    }

    case "provide": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      const useSite = B.expectSymbol(instr.attributes, "use-site")
      const useSiteIdx = lookupIndex(state, useSite)
      if (srcIdx !== useSiteIdx) {
        return [Xvm.Instr("move", [toIntOp(useSiteIdx), toIntOp(srcIdx)], loc)]
      }
      return []
    }

    case "use": {
      return []
    }

    case "ref": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [
        Xvm.Instr("ref", [toIntOp(dstIdx), Xvm.VarOperand(name, loc)], loc),
      ]
    }

    case "global-load": {
      const dstIdx = lookupIndex(state, instr.output[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [
        Xvm.Instr(
          "global-load",
          [toIntOp(dstIdx), Xvm.VarOperand(name, loc)],
          loc,
        ),
      ]
    }

    case "global-store": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      const name = B.expectSymbol(instr.attributes, "name")
      return [
        Xvm.Instr(
          "global-store",
          [toIntOp(srcIdx), Xvm.VarOperand(name, loc)],
          loc,
        ),
      ]
    }

    case "call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((c) => toIntOp(lookupIndex(state, c.id)))
      const result: Array<Xvm.Instr> = [
        Xvm.Instr("call", [Xvm.VarOperand(name, loc), ...args], loc),
      ]
      if (instr.output.length > 0) {
        const dstIdx = lookupIndex(state, instr.output[0].id)
        result.push(Xvm.Instr("load-result", [toIntOp(dstIdx)], loc))
      }
      return result
    }

    case "tail-call": {
      const name = B.expectSymbol(instr.attributes, "name")
      const args = instr.input.map((c) => toIntOp(lookupIndex(state, c.id)))
      return [Xvm.Instr("tail-call", [Xvm.VarOperand(name, loc), ...args], loc)]
    }

    case "apply": {
      const targetIdx = lookupIndex(state, instr.input[0].id)
      const args = instr.input
        .slice(1)
        .map((c) => toIntOp(lookupIndex(state, c.id)))
      const result: Array<Xvm.Instr> = [
        Xvm.Instr("apply", [toIntOp(targetIdx), ...args], loc),
      ]
      if (instr.output.length > 0) {
        const dstIdx = lookupIndex(state, instr.output[0].id)
        result.push(Xvm.Instr("load-result", [toIntOp(dstIdx)], loc))
      }
      return result
    }

    case "tail-apply": {
      const targetIdx = lookupIndex(state, instr.input[0].id)
      const args = instr.input
        .slice(1)
        .map((c) => toIntOp(lookupIndex(state, c.id)))
      return [Xvm.Instr("tail-apply", [toIntOp(targetIdx), ...args], loc)]
    }

    case "branch": {
      const condIdx = lookupIndex(state, instr.input[0].id)
      const thenLabel = B.expectSymbol(instr.attributes, "then-label")
      const elseLabel = B.expectSymbol(instr.attributes, "else-label")
      return [
        Xvm.Instr(
          "jump-if-not",
          [toIntOp(condIdx), Xvm.VarOperand(elseLabel, loc)],
          loc,
        ),
        Xvm.Instr("jump", [Xvm.VarOperand(thenLabel, loc)], loc),
      ]
    }

    case "goto": {
      const label = B.expectSymbol(instr.attributes, "label")
      return [Xvm.Instr("jump", [Xvm.VarOperand(label, loc)], loc)]
    }

    case "return": {
      const srcIdx = lookupIndex(state, instr.input[0].id)
      return [Xvm.Instr("return", [toIntOp(srcIdx)], loc)]
    }

    default: {
      let message = `[codegenInstr] unhandled instr op: ${instr.op}`
      console.error(message)
      return []
    }
  }
}
