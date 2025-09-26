import assert from "node:assert"
import { flags } from "../../flags.ts"
import { formatValue, formatValues } from "../format/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { applyDataPredicateWithAnything } from "./applyDataPredicate.ts"

export function applyDataPutter(
  putter: Values.DataPutter,
  args: Array<Value>,
): Value {
  if (args.length !== 2) {
    let message = `[applyDataPutter] data putter can only take two arguments\n`
    message += `  target: ${formatValue(putter)}\n`
    message += `  args: ${formatValues(args)}\n`
    throw new Error(message)
  }

  const [value, data] = args

  if (!Values.isData(data)) {
    let message = `[applyDataPutter] data putter can only take data as the second argument\n`
    message += `  target: ${formatValue(putter)}\n`
    message += `  args: ${formatValues(args)}\n`
    throw new Error(message)
  }

  if (Values.dataHashtag(data).content !== putter.constructor.name) {
    let message = `[applyDataPutter] data putter constructor mismatch\n`
    message += `  target: ${formatValue(putter)}\n`
    message += `  args: ${formatValues(args)}\n`
    throw new Error(message)
  }

  // index + 1 for the head hashtag.
  data.elements[putter.fieldIndex + 1] = value

  if (flags.debug) {
    const predicate = putter.constructor.spec.predicate
    const ok = applyDataPredicateWithAnything(predicate, data)
    assert(Values.isBool(ok))
    if (Values.isFalse(ok)) {
      let message = `[applyDataPutter] result data cannot possibly pass data predicate\n`
      message += `  putter: ${formatValue(putter)}\n`
      message += `  putting value: ${formatValue(value)}\n`
      message += `  result data: ${formatValue(data)}\n`
      message += `  data predicate: ${formatValue(predicate)}\n`
      throw new Error(message)
    }
  }

  return data
}
