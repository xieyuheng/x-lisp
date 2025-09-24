import assert from "node:assert"
import { flags } from "../../flags.ts"
import { formatValue } from "../format/index.ts"
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
      let message = `[applyDataConstructor] result data cannot possibly pass data predicate\n`
      message += `  constructor: ${formatValue(constructor)}\n`
      message += `  args: [${args.map(formatValue).join(" ")}]\n`
      message += `  result data: ${formatValue(data)}\n`
      message += `  data predicate: ${formatValue(predicate)}\n`
      throw new Error(message)
    }
  }

  return data
}
