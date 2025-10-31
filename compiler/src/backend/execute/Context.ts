import assert from "node:assert"
import type { Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import type { Frame } from "./Frame.ts"

export type Context = {
  mod: Mod
  frames: Array<Frame>
  result?: Value
}

export function createContext(mod: Mod): Context {
  return {
    mod,
    frames: [],
    result: undefined,
  }
}

export function contextIsFinished(context: Context): boolean {
  return context.frames.length === 0
}

export function contextCurrentFrame(context: Context): Frame {
  assert(!contextIsFinished(context))
  return context.frames[context.frames.length - 1]
}
