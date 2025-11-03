import * as X from "@xieyuheng/x-sexp.js"
import { frameLookup, framePut } from "../execute/index.ts"
import { formatInstr } from "../format/index.ts"
import { instrDest, instrOperands, type Instr } from "../instr/index.ts"
import type { Value } from "../value/index.ts"
import type { Execute, Plugin } from "./Plugin.ts"

export function defineControlFlowInstr(
  plugin: Plugin,
  name: string,
  execute: Execute,
): void {
  plugin.handlers[name] = { execute }
}

export function definePrimitiveFunction(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: (...args: Array<Value>) => Value,
): void {
  plugin.handlers[name] = {
    execute(context, frame, instr) {
      const args = instrOperands(instr).map((operand) => frameLookup(frame, operand))
      if (args.length !== arity) {
        let message = `(${instr.op}) instruction arity mismatch`
        message += `\n  arity: ${arity}`
        message += `\n  instr: ${formatInstr(instr)}`
        if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      const result = fn(...args)
      const dest = instrDest(instr)
      if (dest) {
        framePut(frame, dest, result)
      }
    },
  }
}

export function definePrimitiveFunctionWithInstr(
  plugin: Plugin,
  name: string,
  arity: number,
  fn: (instr: Instr) => (...args: Array<Value>) => Value,
): void {
  plugin.handlers[name] = {
    execute(context, frame, instr) {
      const args = instrOperands(instr).map((operand) => frameLookup(frame, operand))
      if (args.length !== arity) {
        let message = `(${instr.op}) instruction arity mismatch`
        message += `\n  arity: ${arity}`
        message += `\n  instr: ${formatInstr(instr)}`
        if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      const result = fn(instr)(...args)
      const dest = instrDest(instr)
      if (dest) {
        framePut(frame, dest, result)
      }
    },
  }
}
