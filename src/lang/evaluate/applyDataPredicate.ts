import assert from "node:assert"
import { useBuiltinPreludeMod } from "../builtin/index.ts"
import { emptyEnv, envSetValue } from "../env/index.ts"
import { formatValue } from "../format/index.ts"
import { modLookupValue } from "../mod/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { apply } from "./apply.ts"
import { evaluate, resultValue } from "./evaluate.ts"

export function applyDataPredicate(
  predicate: Values.DataPredicate,
  args: Array<Value>,
): Value {
  const arity = predicate.parameters.length + 1
  assert(args.length === arity)

  let env = emptyEnv()
  for (const [index, parameter] of predicate.parameters.entries()) {
    env = envSetValue(env, parameter, args[index])
  }

  const data = args[args.length - 1]
  if (Values.isHashtag(data)) {
    const constructor = predicate.spec.constructors[data.content]
    if (constructor === undefined) {
      return Values.Bool(false)
    }

    if (constructor.fields.length !== 0) {
      return Values.Bool(false)
    }

    return Values.Bool(true)
  }

  if (Values.isData(data)) {
    const constructor =
      predicate.spec.constructors[Values.dataHashtag(data).content]
    if (constructor === undefined) {
      return Values.Bool(false)
    }

    for (const [index, field] of constructor.fields.entries()) {
      const target = resultValue(
        evaluate(field.predicate)(predicate.spec.mod, env),
      )
      // index + 1 over the head hashtag.
      const element = data.elements[index + 1]
      if (element === undefined) {
        return Values.Bool(false)
      }

      const result = apply(target, [element])
      if (!Values.isBool(result)) {
        let message = `[applyDataPredicate] I expect the result of a data field predicate to be bool\n`
        message += `  data field predicate: ${formatValue(target)}\n`
        message += `  data element: ${formatValue(element)}\n`
        message += `  result: ${formatValue(result)}\n`
        throw new Error(message)
      } else if (Values.isFalse(result)) {
        return Values.Bool(false)
      }
    }

    return Values.Bool(true)
  }

  return Values.Bool(false)
}

export function applyDataPredicateWithAnything(
  predicate: Values.DataPredicate,
  data: Value,
): Value {
  const preludeMod = useBuiltinPreludeMod()
  const anything = modLookupValue(preludeMod, "anything?")
  assert(anything)
  return applyDataPredicate(predicate, [
    ...predicate.parameters.map((_) => anything),
    data,
  ])
}
