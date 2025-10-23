import { frameEval, framePut } from "../execute/index.ts"
import { formatInstr } from "../format/index.ts"
import type { Instr } from "../instr/index.ts"
import type { Value } from "../value/index.ts"
import type { Execute, Plugin } from "./Plugin.ts"

export function defineControlFlowInstr(
  plugin: Plugin,
  name: string,
  execute: Execute,
): void {
  plugin.handlers[name] = { execute }
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
        message += `\n  instr: ${formatInstr(instr)}`
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
        message += `\n  instr: ${formatInstr(instr)}`
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
        message += `\n  instr: ${formatInstr(instr)}`
        throw new Error(message)
      }

      if (instr.dest !== undefined) {
        let message = `(${instr.op}) effect instruction should not have dest variable`
        message += `\n  instr: ${formatInstr(instr)}`
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
        message += `\n  instr: ${formatInstr(instr)}`
        throw new Error(message)
      }

      if (instr.dest !== undefined) {
        let message = `(${instr.op}) effect instruction should not have dest variable`
        message += `\n  instr: ${formatInstr(instr)}`
        throw new Error(message)
      }

      fn(instr)(...args)
    },
  }
}
