import assert from "node:assert"
import {
  frameEval,
  framePut,
  type Context,
  type Frame,
} from "../execute/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Value } from "../value/index.ts"

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

type ValueFn = (...args: Array<Value>) => Value

export function pluginDefineFunction(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: ValueFn,
): void {
  plugin.handlers[name] = {
    execute(context, frame, instr) {
      assert(instr.dest)
      const args = instr.operands.map((operand) => frameEval(frame, operand))
      const result = fn(...args)
      framePut(frame, instr.dest, result)
    },
  }
}
