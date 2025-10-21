import type { Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import type { Frame } from "./Frame.ts"

export type Context = {
  mod: Mod
  frames: Array<Frame>
  result?: Value
}

export function contextIsFinished(context: Context): boolean {
  return context.frames.length === 0
}
