import { type FunctionDefinition } from "../definition/Definition.ts"
import { type Instr } from "../instr/Instr.ts"
import { instructionSize } from "./instruction.ts"

export type AssembleContext = {
  functionName: string
  slotMap: Map<string, number>
  labels: Map<string, number>
  code: Uint8Array
  offset: number
  localCount: number
}

export function makeAssembleContext(
  definition: FunctionDefinition,
): AssembleContext {
  const { slotMap, localCount } = allocateSlots(definition)
  const sizes = definition.instrs.map(instructionSize)
  const labels = collectLabels(definition.instrs, sizes)
  const code = new Uint8Array(sizes.reduce((sum, size) => sum + size, 0))

  return {
    functionName: definition.name,
    slotMap,
    labels,
    code,
    offset: 0,
    localCount,
  }
}

function allocateSlots(definition: FunctionDefinition): {
  slotMap: Map<string, number>
  localCount: number
} {
  const slotMap = new Map<string, number>()

  definition.parameters.forEach((parameter, index) => {
    slotMap.set(parameter, index)
  })

  let nextSlot = definition.parameters.length
  for (const instr of definition.instrs) {
    if (instr.op === "label") continue

    for (const operand of instr.operands) {
      if (operand.kind !== "VarOperand") continue
      if (slotMap.has(operand.name)) continue

      slotMap.set(operand.name, nextSlot)
      nextSlot += 1
    }
  }

  return {
    slotMap,
    localCount: nextSlot,
  }
}

function collectLabels(
  instrs: Array<Instr>,
  sizes: Array<number>,
): Map<string, number> {
  const labels = new Map<string, number>()
  let offset = 0

  for (let i = 0; i < instrs.length; i++) {
    const instr = instrs[i]
    if (instr.op === "label") {
      const operand = instr.operands[0]
      if (operand.kind !== "VarOperand") {
        throw new Error("[collectLabels] label must have VarOperand")
      }

      if (labels.has(operand.name)) {
        throw new Error(`[collectLabels] duplicate label: ${operand.name}`)
      }

      labels.set(operand.name, offset)
    }

    offset += sizes[i]
  }

  return labels
}