import assert from "node:assert"
import type { Block } from "../block/index.ts"
import type { FunctionDefinition } from "../definition/index.ts"
import type { Instr, Operand } from "../instr/index.ts"
import type { Value } from "../value/index.ts"

export type Frame = {
  name: string
  blocks: Map<string, Block>
  block: Block
  index: number
  env: Map<string, Value>
}

export function frameNextInstr(frame: Frame): Instr {
  const instr = frame.block.instrs[frame.index]
  assert(instr)
  frame.index++
  return instr
}

export function createFrame(
  definition: FunctionDefinition,
  args: Array<Value>,
): Frame {
  const entryBlock = definition.blocks.get("entry")
  assert(entryBlock)
  const env: Map<string, Value> = new Map()
  for (const [index, parameter] of definition.parameters.entries()) {
    assert(args[index])
    env.set(parameter, args[index])
  }

  return {
    name: definition.name,
    blocks: definition.blocks,
    block: entryBlock,
    index: 0,
    env,
  }
}

export function frameGet(frame: Frame, name: string): Value | undefined {
  return frame.env.get(name)
}

export function framePut(frame: Frame, name: string, value: Value): void {
  frame.env.set(name, value)
}

export function frameGoto(frame: Frame, label: string): void {
  const block = frame.blocks.get(label)
  if (block === undefined) {
    let message = "[frameGoto] undefined label"
    message += `\n  label: ${label}`
    throw new Error(message)
  }

  frame.block = block
  frame.index = 0
}

export function frameEval(frame: Frame, operand: Operand): Value {
  switch (operand.kind) {
    case "Var": {
      const value = frameGet(frame, operand.name)
      if (value === undefined) {
        let message = "[frameEval] undefined variable"
        message += `\n  name: ${operand.name}`
        throw new Error(message)
      }

      return value
    }

    case "Imm": {
      return operand.value
    }
  }
}
