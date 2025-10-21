import assert from "node:assert"
import type { Block } from "../block/index.ts"
import type { Instr } from "../instr/index.ts"
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
