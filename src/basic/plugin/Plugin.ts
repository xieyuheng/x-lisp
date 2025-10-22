import type { Context, Frame } from "../execute/index.ts"
import type { Instr } from "../instr/index.ts"

export type InstrHandler = {
  execute: (context: Context, frame: Frame, instr: Instr) => void
}

export type Plugin = {
  instrHandlers: Record<string, InstrHandler>
}

export function createPlugin(): Plugin {
  return {
    instrHandlers: {},
  }
}

export function pluginInstr(
  plugin: Plugin,
  name: string,
  instrHandler: InstrHandler,
): void {
  plugin.instrHandlers[name] = instrHandler
}
