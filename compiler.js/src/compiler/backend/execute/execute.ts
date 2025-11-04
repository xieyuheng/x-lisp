import * as X from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { frameGoto, frameLookup, framePut } from "../execute/index.ts"
import { formatValue } from "../format/index.ts"
import { instrOperands, type Instr } from "../instr/index.ts"
import * as Values from "../value/index.ts"
import {
  contextCurrentFrame,
  contextIsFinished,
  type Context,
} from "./Context.ts"
import { frameNextInstr, type Frame } from "./Frame.ts"
import { call, callDefinition } from "./call.ts"
import { modLookupDefinition } from "../mod/index.ts"
import { definitionArity } from "../definition/definitionHelpers.ts"

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
      const definition = modLookupDefinition(context.mod, instr.target)
      if (definition === undefined) {
        let message = `(execute/call) undefined name`
        message += `\n  name: ${instr.target}`
        if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
        else throw Error(message)
      }

      const args = instrOperands(instr).map((x) => frameLookup(frame, x))
      const arity = definitionArity(definition)
      if (args.length !== arity) {
        let message = `(execute/call) arity mismatch`
        message += `\n  arity: ${arity}`
        message += `\n  args length: ${args.length}`
        if (instr.meta) throw new X.ErrorWithMeta(message, instr.meta)
        else throw Error(message)
      }

      callDefinition(context, definition, args)
      if (instr.dest !== undefined) {
        assert(context.result)
        framePut(frame, instr.dest, context.result)
        delete context.result
      }

      return null
    }
  }
}
