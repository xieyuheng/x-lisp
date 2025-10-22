import type { Context, Frame } from "../execute/index.ts"
import type { Instr } from "../instr/index.ts"

type Handler = {
  execute: (context: Context, frame: Frame, instr: Instr) => void
}

export type Plugin = {
  handlers: Record<string, Handler>
}

export function createPlugin(): Plugin {
  return {
    handlers: {},
  }
}

export function pluginInstr(
  plugin: Plugin,
  name: string,
  handler: Handler,
): void {
  plugin.handlers[name] = handler
}
