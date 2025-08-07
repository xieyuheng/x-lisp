import assert from "node:assert"
import { emptyEnv, envUpdate } from "../env/index.ts"
import { equal } from "../equal/index.ts"
import { formatValue } from "../format/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function apply(target: Value, args: Array<Value>): Value {
  if (target.kind === "Lazy") {
    return apply(Values.lazyActive(target), args)
  }

  if (target.kind === "Lambda") {
    if (args.length === 0) {
      throw new Error(
        `[apply] Can not apply lambda to zero arguments\n` +
          `  target: ${formatValue(target)}\n`,
      )
    }

    const [firstArg, ...restArgs] = args
    const nextEnv = envUpdate(target.env, target.name, firstArg)
    const nextTarget = resultValue(evaluate(target.ret)(target.mod, nextEnv))
    return apply(nextTarget, restArgs)
  }

  if (target.kind === "PrimFn") {
    return apply(Values.CurriedPrimFn(target, []), args)
  }

  if (target.kind === "CurriedPrimFn") {
    if (target.args.length + args.length > target.primFn.arity) {
      throw new Error(
        `[apply] Too many arguments\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    } else if (target.args.length + args.length === target.primFn.arity) {
      return target.primFn.fn(...target.args, ...args)
    } else {
      return Values.CurriedPrimFn(target.primFn, [...target.args, ...args])
    }
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
    if (target.args.length + args.length > arity) {
      throw new Error(
        `[apply] Too many arguments\n` +
          `  target: ${formatValue(target)}\n` +
          `  args: [${args.map(formatValue).join(" ")}]\n`,
      )
    } else if (target.args.length + args.length === arity) {
      return applyDataPredicate(target.predicate, [...target.args, ...args])
    } else {
      return Values.CurriedDataPredicate(target.predicate, [
        ...target.args,
        ...args,
      ])
    }
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
