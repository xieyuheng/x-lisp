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

export type Execute = (context: Context, frame: Frame, instr: Instr) => void

type Handler = {
  execute: Execute
}

export function createPlugin(): Plugin {
  return {
    handlers: {},
  }
}

export function defineControlFlowInstr(
  plugin: Plugin,
  name: string,
  execute: Execute,
): void {
  plugin.handlers[name] = { execute }
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

export function definePureInstr(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: (...args: Array<Value>) => Value,
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

export function definePureInstrWithInstr(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: (instr: Instr) => (...args: Array<Value>) => Value,
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

      const result = fn(instr)(...args)
      if (instr.dest) {
        framePut(frame, instr.dest, result)
      }
    },
  }
}

export function defineEffectInstr(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: (...args: Array<Value>) => void,
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

      if (instr.dest !== undefined) {
        let message = `(${instr.op}) effect instruction should not have dest variable`
        message += `\n  dest: ${instr.dest}`
        message += `\n  args: ${formatValues(args)}`
        throw new Error(message)
      }

      fn(...args)
    },
  }
}

export function defineEffectInstrWithInstr(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: (instr: Instr) => (...args: Array<Value>) => void,
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

      if (instr.dest !== undefined) {
        let message = `(${instr.op}) effect instruction should not have dest variable`
        message += `\n  dest: ${instr.dest}`
        message += `\n  args: ${formatValues(args)}`
        throw new Error(message)
      }

      fn(instr)(...args)
    },
  }
}
