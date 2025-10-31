import { type Context, type Frame } from "../execute/index.ts"
import type { Instr } from "../instr/index.ts"

export type Plugin = {
  handlers: Record<string, Handler>
}

export type Execute = (context: Context, frame: Frame, instr: Instr) => void

type Handler = {
  execute: Execute
}

export function createPlugin(): Plugin {
  return {
    handlers: {},
  }
}

export function pluginExecuteInstr(
  plugin: Plugin,
  context: Context,
  frame: Frame,
  instr: Instr,
): void {
  const handler = plugin.handlers[instr.op]
  if (handler === undefined) {
    let message = "[pluginExecuteInstr] undefined op"
    message += `\n  op: ${instr.op}`
    throw new Error(message)
  }

  handler.execute(context, frame, instr)
}
