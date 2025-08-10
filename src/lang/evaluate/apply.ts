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
import { force } from "./force.ts"

export function supply(curried: Values.Curried, args: Array<Value>): Value {
  if (curried.target.kind === "Lambda") {
    const totalArgs = [...curried.args, ...args]

    if (totalArgs.length < curried.arity) {
      return Values.Curried(curried.target, curried.arity, totalArgs)
    }

    return applyLambda(curried.target, totalArgs)
  }

  if (curried.target.kind === "PrimitiveFunction") {
    const totalArgs = [...curried.args, ...args]

    if (totalArgs.length < curried.arity) {
      return Values.Curried(curried.target, curried.arity, totalArgs)
    }

    if (totalArgs.length === curried.arity) {
      return curried.target.fn(...totalArgs)
    }

    let message = `[supply] Too many arguments\n`
    message += `  curried: ${formatValue(curried)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  if (curried.target.kind === "DataPredicate") {
    const totalArgs = [...curried.args, ...args]

    if (totalArgs.length < curried.arity) {
      return Values.Curried(curried.target, curried.arity, totalArgs)
    }

    if (totalArgs.length === curried.arity) {
      return applyDataPredicate(curried.target, totalArgs)
    }

    let message = `[supply] Too many arguments\n`
    message += `  curried: ${formatValue(curried)}\n`
    message += `  args: [${args.map(formatValue).join(" ")}]\n`
    throw new Error(message)
  }

  let message = `[supply] I can not handle this kind of curried target\n`
  message += `  curried target: ${formatValue(curried.target)}\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  throw new Error(message)
}

export function apply(target: Value, args: Array<Value>): Value {
  if (args.length === 0) {
    return force(target)
  }

  if (target.kind === "Lambda") {
    return supply(Values.Curried(target, target.parameters.length, []), args)
  }

  if (target.kind === "Curried") {
    return supply(target, args)
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
    return supply(Values.Curried(target, target.arity, []), args)
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
    return supply(
      Values.Curried(target, target.parameters.length + 1, []),
      args,
    )
  }

  let message = `[apply] I can not handle this kind of target\n`
  message += `  target: ${formatValue(target)}\n`
  message += `  args: [${args.map(formatValue).join(" ")}]\n`
  throw new Error(message)
}
