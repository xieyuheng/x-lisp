import assert from "node:assert"
import { flags } from "../../flags.ts"
import { formatValue, formatValues } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { applyDataPredicateWithAnything } from "./applyDataPredicate.ts"

export function applyDataConstructor(
  constructor: Values.DataConstructor,
  args: Array<Value>,
): Value {
  const data = Values.Data(constructor, args)

  if (flags.debug) {
    const predicate = constructor.spec.predicate
    const ok = applyDataPredicateWithAnything(predicate, data)
    assert(Values.isBool(ok))
    if (Values.isFalse(ok)) {
      let message = `[applyDataConstructor] result data cannot possibly pass data predicate`
      message += `\n  constructor: ${formatValue(constructor)}`
      message += `\n  args: [${formatValues(args)}]`
      message += `\n  result data: ${formatValue(data)}`
      message += `\n  data predicate: ${formatValue(predicate)}`
      throw new Error(message)
    }
  }

  return data
}
