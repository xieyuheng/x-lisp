import assert from "node:assert"
import { flags } from "../../flags.ts"
import { emptyEnv, envLookupValue, envNames } from "../env/index.ts"
import { formatValue, formatValues } from "../format/index.ts"
import { match } from "../pattern/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyDataConstructor } from "./applyDataConstructor.ts"
import { applyDataConstructorPredicate } from "./applyDataConstructorPredicate.ts"
import { applyDataGetter } from "./applyDataGetter.ts"
import { applyDataPredicate } from "./applyDataPredicate.ts"
import { applyDataPutter } from "./applyDataPutter.ts"
import { applyLambda } from "./applyLambda.ts"
import { applyWithSchema } from "./applyWithSchema.ts"
import { force } from "./force.ts"
import { supply } from "./supply.ts"
import { validate } from "./validate.ts"

export function apply(target: Value, args: Array<Value>): Value {
  target = Values.lazyWalk(target)

  if (args.length === 0) {
    return force(target)
  }

  if (target.kind === "Curried") {
    return supply(target.target, target.arity, [...target.args, ...args])
  }

  if (target.kind === "Tau") {
    if (args.length !== 1) {
      let message = `[apply] tau can only take one argument\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: ${formatValues(args)}\n`
      throw new Error(message)
    }

    const result = validate(target, args[0])
    if (result.kind === "Ok") {
      return Values.Bool(true)
    } else {
      return Values.Bool(false)
    }
  }

  if (target.kind === "Lambda" || target.kind === "LambdaLazy") {
    const arity = target.parameters.length
    if (arity === args.length) {
      return applyLambda(target, args)
    } else {
      return supply(target, arity, args)
    }
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
      return target.fn(...args.map(Values.lazyWalk))
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
      let message = `[apply] data constructor predicate can only take one argument\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: ${formatValues(args)}\n`
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
      let message = `[apply] pattern can only take one argument\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: ${formatValues(args)}\n`
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

  let message = `[apply] I can not handle this kind of target\n`
  message += `  target: ${formatValue(target)}\n`
  message += `  args: ${formatValues(args)}\n`
  throw new Error(message)
}
