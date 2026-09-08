import { type FunctionDefinition } from "../definition/Definition.ts"
import { type Instr } from "../instr/Instr.ts"
import { instructionSize } from "./instruction.ts"

export type AssembleContext = {
  functionName: string
  localIndexMap: Map<string, number>
  labelOffsetMap: Map<string, number>
  code: Uint8Array
  offset: number
}

export function lookupLocalIndex(
  localIndexMap: Map<string, number>,
  name: string,
): number {
  const index = localIndexMap.get(name)
  if (index === undefined) {
    throw new Error(`[lookupLocalIndex] unknown local variable: ${name}`)
  }

  return index
}

export function lookupLabelOffset(
  labelOffsetMap: Map<string, number>,
  name: string,
): number {
  const offset = labelOffsetMap.get(name)
  if (offset === undefined) {
    throw new Error(`[lookupLabelOffset] label not found: ${name}`)
  }

  return offset
}

export function makeAssembleContext(
  definition: FunctionDefinition,
): AssembleContext {
  const localIndexMap = buildLocalIndexMap(definition)
  const sizes = definition.instrs.map(instructionSize)
  const labelOffsetMap = collectLabels(definition.instrs, sizes)
  const code = new Uint8Array(sizes.reduce((sum, size) => sum + size, 0))

  return {
    functionName: definition.name,
    localIndexMap,
    labelOffsetMap,
    code,
    offset: 0,
  }
}

function buildLocalIndexMap(
  definition: FunctionDefinition,
): Map<string, number> {
  const localIndexMap = new Map<string, number>()

  definition.parameters.forEach((parameter, index) => {
    localIndexMap.set(parameter, index)
  })

  let nextSlot = definition.parameters.length
  for (const instr of definition.instrs) {
    if (instr.op === "label") continue

    for (const operand of instr.operands) {
      if (operand.kind !== "VarOperand") continue
      if (localIndexMap.has(operand.name)) continue

      localIndexMap.set(operand.name, nextSlot)
      nextSlot += 1
    }
  }

  return localIndexMap
}

function collectLabels(
  instrs: Array<Instr>,
  sizes: Array<number>,
): Map<string, number> {
  const labelOffsetMap = new Map<string, number>()
  let offset = 0

  for (let i = 0; i < instrs.length; i++) {
    const instr = instrs[i]
    if (instr.op === "label") {
      const operand = instr.operands[0]
      if (operand.kind !== "VarOperand") {
        throw new Error("[collectLabels] label must have VarOperand")
      }

      if (labelOffsetMap.has(operand.name)) {
        throw new Error(`[collectLabels] duplicate label: ${operand.name}`)
      }

      labelOffsetMap.set(operand.name, offset)
    }

    offset += sizes[i]
  }

  return labelOffsetMap
}
