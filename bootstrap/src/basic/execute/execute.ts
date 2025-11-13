import * as S from "@xieyuheng/x-sexp.js"
import assert from "node:assert"
import { definitionArity } from "../definition/definitionHelpers.ts"
import { frameGoto, frameLookup } from "../execute/index.ts"
import { formatValue } from "../format/index.ts"
import { type Instr } from "../instr/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Context } from "./Context.ts"
import { type Frame } from "./Frame.ts"
import { apply } from "./apply.ts"
import { applyNullary } from "./applyNullary.ts"
import { callDefinition } from "./call.ts"

export function execute(context: Context, frame: Frame, instr: Instr): null {
  switch (instr.op) {
    case "Argument": {
      const value = frame.args[instr.index]
      if (value === undefined) {
        let message = `[execute] (argument) missing argument`
        message += `\n  index: ${instr.index}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      frame.env.set(instr.dest, value)
      return null
    }

    case "Const": {
      frame.env.set(instr.dest, instr.value)
      return null
    }

    case "Assert": {
      const value = frameLookup(frame, instr.condition)
      if (!Values.isBool(value)) {
        let message = `[execute] (assert) value is not bool`
        message += `\n  value: ${formatValue(value)}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      if (Values.isFalse(value)) {
        let message = `[execute] (assert) assertion fail`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      return null
    }

    case "Return": {
      if (instr.result === undefined) {
        context.result = Values.Void()
      } else {
        context.result = frameLookup(frame, instr.result)
      }

      context.frames.pop()
      return null
    }

    case "Goto": {
      frameGoto(frame, instr.label)
      return null
    }

    case "Branch": {
      const condition = frameLookup(frame, instr.condition)
      assert(Values.isBool(condition))
      if (Values.isTrue(condition)) {
        frameGoto(frame, instr.thenLabel)
      } else {
        frameGoto(frame, instr.elseLabel)
      }

      return null
    }

    case "Call": {
      const definition = modLookupDefinition(context.mod, instr.name)
      if (definition === undefined) {
        let message = `[execute] (call) undefined name`
        message += `\n  name: ${instr.name}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      const args = instr.args.map((x) => frameLookup(frame, x))
      const arity = definitionArity(definition)
      if (args.length !== arity) {
        let message = `[execute] (call) arity mismatch`
        message += `\n  arity: ${arity}`
        message += `\n  args.length: ${args.length}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      const result = callDefinition(context, definition, args)
      if (instr.dest !== undefined) {
        frame.env.set(instr.dest, result)
      }

      return null
    }

    case "NullaryApply": {
      const target = frameLookup(frame, instr.target)
      const result = applyNullary(context, target)
      if (instr.dest !== undefined) {
        frame.env.set(instr.dest, result)
      }

      return null
    }

    case "Apply": {
      const target = frameLookup(frame, instr.target)
      const arg = frameLookup(frame, instr.arg)
      const result = apply(context, target, arg)
      if (instr.dest !== undefined) {
        frame.env.set(instr.dest, result)
      }

      return null
    }
  }
}
