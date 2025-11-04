import * as X from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { type Block } from "../block/index.ts"
import { type FunctionDefinition } from "../definition/index.ts"
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
  assert(instr)
  frame.index++
  return instr
}

export function createFrame(
  definition: FunctionDefinition,
  args: Array<Value>,
): Frame {
  const entryBlock = definition.blocks.get("entry")
  if (entryBlock === undefined) {
    let message = `[createFrame] missing entry block`
    if (definition.meta) throw new X.ErrorWithMeta(message, definition.meta)
    else throw new Error(message)
  }

  return {
    name: definition.name,
    blocks: definition.blocks,
    block: entryBlock,
    index: 0,
    args,
    env: new Map(),
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

export function frameLookup(frame: Frame, name: string): Value {
  const value = frameGet(frame, name)
  if (value === undefined) {
    let message = "[frameLookup] undefined variable"
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  return value
}
