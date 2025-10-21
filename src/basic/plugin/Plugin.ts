import type { Context, Frame } from "../execute/index.ts"
import type { Instr } from "../instr/index.ts"

export type Plugin = {
  execute: (context: Context, frame: Frame, instr: Instr) => void
}
