import {
  frameEval,
  framePut,
  type Context,
  type Frame,
} from "../execute/index.ts"
import { formatValues } from "../format/index.ts"
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
      const args = instr.operands.map((operand) => frameEval(frame, operand))
      if (args.length !== arity) {
        let message = `(${instr.op}) instruction arity mismatch`
        message += `\n  arity: ${arity}`
        message += `\n  args: ${formatValues(args)}`
        throw new Error(message)
      }

      const result = fn(...args)
      if (instr.dest) {
        framePut(frame, instr.dest, result)
      }
    },
  }
}
