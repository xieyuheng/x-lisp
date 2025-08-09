import assert from "node:assert"
import { emptyEnv, envSet } from "../env/index.ts"
import { formatValue } from "../format/index.ts"
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
    env = envSet(env, parameter, args[index])
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
      let message = `[applyDataPredicate] I expect the result of a data field predicate to be bool\n`
      message += `  data field predicate: ${formatValue(target)}\n`
      message += `  data element: ${formatValue(element)}\n`
      message += `  result: ${formatValue(result)}\n`
      throw new Error(message)
    } else if (result.content === false) {
      return Values.Bool(false)
    }
  }

  return Values.Bool(true)
}
