import * as X from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { frameGoto, frameLookup, framePut } from "../execute/index.ts"
import { formatValue } from "../format/index.ts"
import { instrOperands, type Instr } from "../instr/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import {
  contextCurrentFrame,
  contextIsFinished,
  type Context,
} from "./Context.ts"
import { createFrame, frameNextInstr, type Frame } from "./Frame.ts"

export function executeOneStep(context: Context): void {
  if (contextIsFinished(context)) return

  const frame = contextCurrentFrame(context)
  const instr = frameNextInstr(frame)
  executeInstr(context, frame, instr)
}

export function executeInstr(
  context: Context,
  frame: Frame,
  instr: Instr,
): null {
  switch (instr.op) {
    case "Const": {
      framePut(frame, instr.dest, instr.value)
      return null
    }

    case "Assert": {
      const [x] = instrOperands(instr)
      const value = frameLookup(frame, x)
      if (!Values.isBool(value)) {
        let message = `(assert) value is not bool`
        message += `\n  value: ${formatValue(value)}`
        if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
        else throw Error(message)
      }

      if (Values.isFalse(value)) {
        let message = `(assert) assertion fail`
        if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
        else throw Error(message)
      }

      return null
    }

    case "Return": {
      if (instrOperands(instr).length > 0) {
        const [x] = instrOperands(instr)
        context.result = frameLookup(frame, x)
      }

      context.frames.pop()
      return null
    }

    case "Goto": {
      frameGoto(frame, instr.label)
      return null
    }

    case "Branch": {
      const [x] = instrOperands(instr)
      const condition = frameLookup(frame, x)
      assert(condition.kind === "Bool")
      if (condition.content) {
        frameGoto(frame, instr.thenLabel)
      } else {
        frameGoto(frame, instr.elseLabel)
      }

      return null
    }

    case "Call": {
      const args = instrOperands(instr).map((x) => frameLookup(frame, x))
      call(context, instr.target, args)
      if (instr.dest !== undefined) {
        assert(context.result)
        framePut(frame, instr.dest, context.result)
        delete context.result
      }

      return null
    }
  }
}

export function call(context: Context, name: string, args: Array<Value>): null {
  const definition = modLookupDefinition(context.mod, name)
  assert(definition)

  switch (definition.kind) {
    case "FunctionDefinition": {
      const base = context.frames.length
      context.frames.push(createFrame(definition, args))
      while (context.frames.length > base) {
        executeOneStep(context)
      }

      return null
    }

    case "PrimitiveFunctionDefinition": {
      context.result = definition.fn(...args)
      return null
    }
  }
}
