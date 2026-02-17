import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import assert from "node:assert"
import { textWidth } from "../../config.ts"
import { flags } from "../../flags.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyDataPredicateWithAnything } from "./applyDataPredicate.ts"

export function applyDataPutter(
  putter: Values.DataPutter,
  args: Array<Value>,
): Value {
  const width = textWidth

  if (args.length !== 2) {
    let message = `[applyDataPutter] data putter can only take two arguments`
    message += formatUnderTag(2, `putter:`, prettyValue(width, putter))
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  const [value, data] = args

  if (!Values.isData(data)) {
    let message = `[applyDataPutter] data putter can only take data as the second argument`
    message += formatUnderTag(2, `putter:`, prettyValue(width, putter))
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  if (Values.dataHashtag(data).content !== putter.constructor.name) {
    let message = `[applyDataPutter] data putter constructor mismatch`
    message += formatUnderTag(2, `putter:`, prettyValue(width, putter))
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  // index + 1 for the head hashtag.
  data.elements[putter.fieldIndex + 1] = value

  if (flags.debug) {
    const predicate = putter.constructor.spec.predicate
    const ok = applyDataPredicateWithAnything(predicate, data)
    assert(Values.isBoolValue(ok))
    if (Values.isFalseValue(ok)) {
      let message = `[applyDataPutter] result data cannot possibly pass data predicate`
      message += formatUnderTag(2, `putter:`, prettyValue(width, putter))
      message += formatUnderTag(2, `putting value:`, prettyValue(width, value))
      message += formatUnderTag(2, `result data:`, prettyValue(width, data))
      message += formatUnderTag(
        2,
        `data predicate:`,
        prettyValue(width, predicate),
      )
      throw new Error(message)
    }
  }

  return data
}
