import assert from "node:assert"
import { emptyEnv, envPut } from "../env/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { evaluate, resultValue } from "./evaluate.ts"
import { validate } from "./validate.ts"

export function applyDataPredicate(
  predicate: Values.DataPredicate,
  args: Array<Value>,
): Value {
  const arity = predicate.parameters.length + 1
  assert(args.length === arity)

  let env = emptyEnv()
  for (const [index, parameter] of predicate.parameters.entries()) {
    env = envPut(env, parameter, args[index])
  }

  const data = args[args.length - 1]
  if (Values.isHashtagValue(data)) {
    const constructor = predicate.spec.constructors[data.content]
    if (constructor === undefined) {
      return Values.BoolValue(false)
    }

    if (constructor.fields.length !== 0) {
      return Values.BoolValue(false)
    }

    return Values.BoolValue(true)
  }

  if (Values.isData(data)) {
    const constructor =
      predicate.spec.constructors[Values.dataHashtag(data).content]
    if (constructor === undefined) {
      return Values.BoolValue(false)
    }

    for (const [index, field] of constructor.fields.entries()) {
      const target = resultValue(
        evaluate(field.predicate)(predicate.spec.mod, env),
      )
      // index + 1 over the head hashtag.
      const element = data.elements[index + 1]
      if (element === undefined) {
        return Values.BoolValue(false)
      }

      const result = validate(target, element)
      if (result.kind === "Err") {
        return Values.BoolValue(false)
      }
    }

    return Values.BoolValue(true)
  }

  return Values.BoolValue(false)
}

const isAny = Values.PrimitiveFunctionValue("any?", 1, () =>
  Values.BoolValue(true),
)

export function applyDataPredicateWithAnything(
  predicate: Values.DataPredicate,
  data: Value,
): Value {
  return applyDataPredicate(predicate, [
    ...predicate.parameters.map((_) => isAny),
    data,
  ])
}
