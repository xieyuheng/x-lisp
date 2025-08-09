import assert from "node:assert"
import { flags } from "../../flags.ts"
import { emptyEnv, envUpdate } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function apply(target: Value, args: Array<Value>): Value {
  if (target.kind === "Lambda") {
    return apply(Values.CurriedLambda(target, []), args)
  }

  if (target.kind === "CurriedLambda") {
    if (args.length === 0) {
      throw new Error(
        `[apply] Can not apply lambda to zero arguments\n` +
          `  target: ${formatValue(target)}\n`,
      )
    }

    const arity = target.lambda.parameters.length
    const totalArgs = [...target.args, ...args]

    if (totalArgs.length < arity) {
      return Values.CurriedLambda(target.lambda, totalArgs)
    }

    let env = target.lambda.env
    for (const [index, parameter] of target.lambda.parameters.entries()) {
      env = envUpdate(env, parameter, totalArgs[index])
    }

    const restArgs = totalArgs.slice(arity)
    const result = resultValue(
      evaluate(target.lambda.body)(target.lambda.mod, env),
    )
    if (restArgs.length === 0) {
      return result
    } else {
      return apply(result, restArgs)
    }
  }

  if (target.kind === "Arrow") {
    const [firstArg, ...restArgs] = args
    assert(firstArg)
    return apply(Values.Claimed(firstArg, target), restArgs)
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

    throw new Error(
      `[apply] Too many arguments\n` +
        `  target: ${formatValue(target)}\n` +
        `  args: [${args.map(formatValue).join(" ")}]\n`,
    )
  }

  if (target.kind === "DataConstructor") {
    if (target.fields.length !== args.length) {
      throw new Error(
        `[apply] data constructor arity mismatch\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }

    return Values.Data(target, args)
  }

  if (target.kind === "DataConstructorPredicate") {
    if (args.length !== 1) {
      throw new Error(
        `[apply] data constructor predicate can only take one argument\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }

    const data = args[0]

    return Values.Bool(
      data.kind === "Data" && equal(target.constructor, data.constructor),
    )
  }

  if (target.kind === "DataGetter") {
    if (args.length !== 1) {
      throw new Error(
        `[apply] data getter can only take one argument\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }

    const data = args[0]

    if (data.kind !== "Data") {
      throw new Error(
        `[apply] data getter can only take data as argument\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }

    if (!equal(data.constructor, target.constructor)) {
      throw new Error(
        `[apply] data getter constructor mismatch\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    }

    return data.elements[target.fieldIndex]
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

    throw new Error(
      `[apply] Too many arguments\n` +
        `  target: ${formatValue(target)}\n` +
        `  args: [${args.map(formatValue).join(" ")}]\n`,
    )
  }

  throw new Error(
    `[apply] I can not handle this kind of target\n` +
      `  target: ${formatValue(target)}\n` +
      `  args: [${args.map(formatValue).join(" ")}]\n`,
  )
}

function applyDataPredicate(
  predicate: Values.DataPredicate,
  args: Array<Value>,
): Value {
  const arity = predicate.parameters.length + 1
  assert(args.length === arity)

  let env = emptyEnv()
  for (const [index, parameter] of predicate.parameters.entries()) {
    env = envUpdate(env, parameter, args[index])
  }

  const data = args[args.length - 1]
  if (data.kind !== "Data") return Values.Bool(false)
  const constructor = predicate.spec.constructors[data.constructor.name]
  if (constructor === undefined) return Values.Bool(false)
  for (const [index, field] of constructor.fields.entries()) {
    const target = resultValue(
      evaluate(field.predicate)(predicate.spec.mod, env),
    )
    const element = data.elements[index]
    const result = apply(target, [element])
    if (result.kind !== "Bool") {
      throw new Error(
        `[applyDataPredicate] I expect the result of a data field predicate to be bool\n` +
          `  data field predicate: ${formatValue(target)}\n` +
          `  data element: ${formatValue(element)}\n` +
          `  result: ${formatValue(result)}\n`,
      )
    } else if (result.content === false) {
      return Values.Bool(false)
    }
  }

  return Values.Bool(true)
}

function applyWithSchema(
  schema: Value,
  target: Value,
  args: Array<Value>,
): Value {
  if (schema.kind === "Arrow") {
    const arrow = Values.arrowNormalize(schema)
    //
  }

  let message = `[applyWithSchema] unhandled kind of schema\n`
  message += `  schema: ${formatValue(schema)}\n`
  throw new Error(message)
}
