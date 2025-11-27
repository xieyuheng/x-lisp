import * as S from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import {
  SetupDefinition,
  type FunctionDefinition,
} from "../definition/index.ts"
import { type Instr } from "../instr/index.ts"
import { type Value } from "../value/index.ts"

export type Frame = {
  name: string
  blocks: Map<string, Block>
  block: Block
  index: number
  args: Array<Value>
  env: Map<string, Value>
}

export function frameNextInstr(frame: Frame): Instr {
  const instr = frame.block.instrs[frame.index]
  if (instr === undefined) {
    let message = `[frameNextInstr] no more instructions`
    message += `\n  frame.name: ${frame.name}`
    message += `\n  frame.index: ${frame.index}`
    throw new Error(message)
  }

  frame.index++
  return instr
}

export function createFrame(
  definition: FunctionDefinition | SetupDefinition,
  args: Array<Value>,
): Frame {
  const blocks = Array.from(definition.blocks.values())
  const firstBlock = blocks[0]
  if (firstBlock === undefined) {
    let message = `[createFrame] the definition has no first block`
    if (definition.meta) throw new S.ErrorWithMeta(message, definition.meta)
    else throw new Error(message)
  }

  return {
    name: definition.name,
    blocks: definition.blocks,
    block: firstBlock,
    index: 0,
    args,
    env: new Map(),
  }
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

export function frameLookup(frame: Frame, name: string): Value {
  const value = frame.env.get(name)
  if (value === undefined) {
    let message = "[frameLookup] undefined variable"
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  return value
}
