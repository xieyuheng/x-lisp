import type { Context, Frame } from "../execute/index.ts"
import type { Instr } from "../instr/index.ts"

export type Plugin = {
  handlers: Record<string, Handler>
}

type Handler = {
  execute: (context: Context, frame: Frame, instr: Instr) => void
}

export function createPlugin(): Plugin {
  return {
    handlers: {},
  }
}

export function pluginDefineHandler(
  plugin: Plugin,
  name: string,
  handler: Handler,
): void {
  plugin.handlers[name] = handler
}

export function pluginGetHandler(
  plugin: Plugin,
  name: string,
): Handler | undefined {
  return plugin.handlers[name]
}
