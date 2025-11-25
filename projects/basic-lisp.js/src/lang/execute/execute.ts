import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import { definitionArity } from "../definition/definitionHelpers.ts"
import { frameGoto, frameLookup } from "../execute/index.ts"
import { formatInstr, formatValue } from "../format/index.ts"
import { type Instr } from "../instr/index.ts"
import { modLookupDefinition } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { type Context } from "./Context.ts"
import { type Frame } from "./Frame.ts"
import { apply } from "./apply.ts"
import { applyNullary } from "./applyNullary.ts"
import { call } from "./call.ts"

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
        context.returnValue = Values.Void()
      } else {
        context.returnValue = frameLookup(frame, instr.result)
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
      const definition = modLookupDefinition(context.mod, instr.fn.name)
      if (definition === undefined) {
        let message = `[execute] (call) undefined function name`
        message += `\n  instruction: ${formatInstr(instr)}`
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

      const result = call(context, definition, args)
      frame.env.set(instr.dest, result)
      return null
    }

    case "ApplyNullary": {
      const target = frameLookup(frame, instr.target)
      const result = applyNullary(context, target)
      frame.env.set(instr.dest, result)
      return null
    }

    case "Apply": {
      const target = frameLookup(frame, instr.target)
      const arg = frameLookup(frame, instr.arg)
      const result = apply(context, target, arg)
      frame.env.set(instr.dest, result)
      return null
    }

    case "Load": {
      const definition = modLookupDefinition(context.mod, instr.name)
      if (definition === undefined) {
        let message = `[execute] (load) undefined variable name`
        message += `\n  instruction: ${formatInstr(instr)}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      if (definition.kind !== "VariableDefinition") {
        let message = `[execute] (load) expect VaribaleDefinition`
        message += `\n  definition kind: ${definition.kind}`
        message += `\n  instruction: ${formatInstr(instr)}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      if (Values.isUndefined(definition.value)) {
        let message = `[execute] (load) uninitialized varibale`
        message += `\n  definition kind: ${definition.kind}`
        message += `\n  instruction: ${formatInstr(instr)}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      frame.env.set(instr.dest, definition.value)
      return null
    }

    case "Store": {
      const definition = modLookupDefinition(context.mod, instr.name)
      if (definition === undefined) {
        let message = `[execute] (store) undefined variable name`
        message += `\n  instruction: ${formatInstr(instr)}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      if (definition.kind !== "VariableDefinition") {
        let message = `[execute] (load) expect VaribaleDefinition`
        message += `\n  definition kind: ${definition.kind}`
        message += `\n  instruction: ${formatInstr(instr)}`
        if (instr.meta) throw new S.ErrorWithMeta(message, instr.meta)
        else throw new Error(message)
      }

      definition.value = frameLookup(frame, instr.source)
      return null
    }
  }
}
