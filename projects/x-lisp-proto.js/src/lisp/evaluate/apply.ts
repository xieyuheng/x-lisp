import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import assert from "node:assert"
import { textWidth } from "../../config.ts"
import { flags } from "../../flags.ts"
import { emptyEnv, envLookupValue, envNames } from "../env/index.ts"
import { match } from "../pattern/index.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyClosure } from "./applyClosure.ts"
import { applyDataConstructor } from "./applyDataConstructor.ts"
import { applyDataConstructorPredicate } from "./applyDataConstructorPredicate.ts"
import { applyDataGetter } from "./applyDataGetter.ts"
import { applyDataPredicate } from "./applyDataPredicate.ts"
import { applyDataPutter } from "./applyDataPutter.ts"
import { applyNullary } from "./applyNullary.ts"
import { applyVariadicClosure } from "./applyVariadicClosure.ts"
import { applyWithSchema } from "./applyWithSchema.ts"
import { supply } from "./supply.ts"
import { validate } from "./validate.ts"

export function apply(target: Value, args: Array<Value>): Value {
  const width = textWidth

  if (args.length === 0) {
    return applyNullary(target)
  }

  if (target.kind === "Curry") {
    return supply(target.target, target.arity, [...target.args, ...args])
  }

  if (target.kind === "Tau") {
    if (args.length !== 1) {
      let message = `[apply] tau can only take one argument`
      message += formatUnderTag(2, `target:`, prettyValue(width, target))
      message += formatUnderTag(2, `args:`, prettyValues(width, args))
      throw new Error(message)
    }

    const result = validate(target, args[0])
    if (result.kind === "Ok") {
      return Values.Bool(true)
    } else {
      return Values.Bool(false)
    }
  }

  if (target.kind === "Closure") {
    const arity = target.parameters.length
    if (arity === args.length) {
      return applyClosure(target, args)
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "VariadicClosure") {
    return applyVariadicClosure(target, args)
  }

  if (target.kind === "The") {
    if (flags.debug) {
      return applyWithSchema(target.schema, target.value, args)
    } else {
      return apply(target.value, args)
    }
  }

  if (target.kind === "PrimitiveFunction") {
    const arity = target.arity
    if (arity === args.length) {
      return target.fn(...args)
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "DataConstructor") {
    const arity = target.fields.length
    if (arity === args.length) {
      return applyDataConstructor(target, args)
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "DataConstructorPredicate") {
    if (args.length !== 1) {
      let message = `[apply] data constructor predicate can only take one argument`
      message += formatUnderTag(2, `target:`, prettyValue(width, target))
      message += formatUnderTag(2, `args:`, prettyValues(width, args))
      throw new Error(message)
    }

    return applyDataConstructorPredicate(target, args[0])
  }

  if (target.kind === "DataGetter") {
    return applyDataGetter(target, args)
  }

  if (target.kind === "DataPutter") {
    const arity = 2
    if (arity === args.length) {
      return applyDataPutter(target, args)
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "DataPredicate") {
    const arity = target.parameters.length + 1
    if (arity === args.length) {
      return applyDataPredicate(target, args)
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "Pattern") {
    if (args.length !== 1) {
      let message = `[apply] pattern can only take one argument`
      message += formatUnderTag(2, `target:`, prettyValue(width, target))
      message += formatUnderTag(2, `args:`, prettyValues(width, args))
      throw new Error(message)
    }

    const value = args[0]
    const resultEnv = match(target.pattern, value)(emptyEnv())
    if (resultEnv === undefined) {
      return Values.Null()
    }

    const attributes: Record<string, Value> = {}
    for (const name of envNames(resultEnv)) {
      const value = envLookupValue(resultEnv, name)
      assert(value)
      attributes[name] = value
    }

    return Values.Record(attributes)
  }

  let message = `[apply] can not handle this kind of target`
  message += formatUnderTag(2, `target:`, prettyValue(width, target))
  message += formatUnderTag(2, `args:`, prettyValues(width, args))
  throw new Error(message)
}
