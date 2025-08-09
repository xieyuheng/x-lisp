import assert from "node:assert"
import { flags } from "../../flags.ts"
import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyDataGetter } from "./applyDataGetter.ts"
import { applyDataPredicate } from "./applyDataPredicate.ts"
import { applyLambda } from "./applyLambda.ts"
import { applyWithSchema } from "./applyWithSchema.ts"

export function apply(target: Value, args: Array<Value>): Value {
  if (target.kind === "Lambda") {
    return apply(Values.CurriedLambda(target, []), args)
  }

  if (target.kind === "CurriedLambda") {
    if (args.length === 0) {
      let message = `[apply] Can not apply lambda to zero arguments\n`
      message += `  target: ${formatValue(target)}\n`
      throw new Error(message)
    }

    const arity = target.lambda.parameters.length
    const totalArgs = [...target.args, ...args]

    if (totalArgs.length < arity) {
      return Values.CurriedLambda(target.lambda, totalArgs)
    }

    return applyLambda(target.lambda, totalArgs)
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

  if (target.kind === "PrimFn") {
    return apply(Values.CurriedPrimFn(target, []), args)
  }

  if (target.kind === "CurriedPrimFn") {
    const arity = target.primFn.arity
    const totalArgs = [...target.args, ...args]

    if (totalArgs.length < arity) {
      return Values.CurriedPrimFn(target.primFn, totalArgs)
    }

    if (totalArgs.length === arity) {
      return target.primFn.fn(...totalArgs)
    }

    let message = `[apply] Too many arguments\n`
    message += `  target: ${formatValue(target)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
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
    return apply(Values.CurriedDataPredicate(target, []), args)
  }

  if (target.kind === "CurriedDataPredicate") {
    const arity = target.predicate.parameters.length + 1
    const totalArgs = [...target.args, ...args]

    if (totalArgs.length < arity) {
      return Values.CurriedDataPredicate(target.predicate, totalArgs)
    }

    if (totalArgs.length === arity) {
      return applyDataPredicate(target.predicate, totalArgs)
    }

    let message = `[apply] Too many arguments\n`
    message += `  target: ${formatValue(target)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  let message = `[apply] I can not handle this kind of target\n`
  message += `  target: ${formatValue(target)}\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  throw new Error(message)
}
