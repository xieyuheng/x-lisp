import assert from "node:assert"
import { flags } from "../../flags.ts"
import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value, lazyWalk } from "../value/index.ts"
import { applyDataGetter } from "./applyDataGetter.ts"
import { applyDataPredicate } from "./applyDataPredicate.ts"
import { applyLambda } from "./applyLambda.ts"
import { applyWithSchema } from "./applyWithSchema.ts"
import { force } from "./force.ts"
import { supply } from "./supply.ts"

export function apply(target: Value, args: Array<Value>): Value {
  target = lazyWalk(target)

  if (args.length === 0) {
    return force(target)
  }

  if (target.kind === "Curried") {
    return supply(target.target, target.arity, [...target.args, ...args])
  }

  if (target.kind === "Lambda" || target.kind === "LambdaLazy") {
    const arity = target.parameters.length
    if (arity === args.length) {
      return applyLambda(target, args)
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "Arrow") {
    const [firstArg, ...restArgs] = args
    assert(firstArg)
    if (restArgs.length === 0) {
      return Values.Claimed(firstArg, target)
    } else {
      return apply(Values.Claimed(firstArg, target), restArgs)
    }
  }

  if (target.kind === "Claimed") {
    if (flags.debug) {
      return applyWithSchema(target.schema, target.value, args)
    } else {
      return apply(target.value, args)
    }
  }

  if (target.kind === "PrimitiveFunction") {
    const arity = target.arity
    if (arity === args.length) {
      return target.fn(...args.map(lazyWalk))
    } else {
      return supply(target, arity, args)
    }
  }

  if (target.kind === "DataConstructor") {
    if (target.fields.length !== args.length) {
      let message = `[apply] data constructor arity mismatch\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      throw new Error(message)
    }

    return Values.Data(target, args)
  }

  if (target.kind === "DataConstructorPredicate") {
    if (args.length !== 1) {
      let message = `[apply] data constructor predicate can only take one argument\n`
      message += `  target: ${formatValue(target)}\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      throw new Error(message)
    }

    const data = args[0]
    return Values.Bool(
      data.kind === "Data" && equal(target.constructor, data.constructor),
    )
  }

  if (target.kind === "DataGetter") {
    return applyDataGetter(target, args)
  }

  if (target.kind === "DataPredicate") {
    const arity = target.parameters.length + 1
    if (arity === args.length) {
      return applyDataPredicate(target, args)
    } else {
      return supply(target, arity, args)
    }
  }

  let message = `[apply] I can not handle this kind of target\n`
  message += `  target: ${formatValue(target)}\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  throw new Error(message)
}
