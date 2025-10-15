import assert from "node:assert"
import { flags } from "../../flags.ts"
import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helpers/format/formatUnderTag.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { applyDataPredicateWithAnything } from "./applyDataPredicate.ts"

export function applyDataPutter(
  putter: Values.DataPutter,
  args: Array<Value>,
): Value {
  const maxWidth = globals.maxWidth

  if (args.length !== 2) {
    let message = `[applyDataPutter] data putter can only take two arguments`
    message += formatUnderTag(2, `putter:`, prettyValue(maxWidth, putter))
    message += formatUnderTag(2, `args:`, prettyValues(maxWidth, args))
    throw new Error(message)
  }

  const [value, data] = args

  if (!Values.isData(data)) {
    let message = `[applyDataPutter] data putter can only take data as the second argument`
    message += formatUnderTag(2, `putter:`, prettyValue(maxWidth, putter))
    message += formatUnderTag(2, `args:`, prettyValues(maxWidth, args))
    throw new Error(message)
  }

  if (Values.dataHashtag(data).content !== putter.constructor.name) {
    let message = `[applyDataPutter] data putter constructor mismatch`
    message += formatUnderTag(2, `putter:`, prettyValue(maxWidth, putter))
    message += formatUnderTag(2, `args:`, prettyValues(maxWidth, args))
    throw new Error(message)
  }

  // index + 1 for the head hashtag.
  data.elements[putter.fieldIndex + 1] = value

  if (flags.debug) {
    const predicate = putter.constructor.spec.predicate
    const ok = applyDataPredicateWithAnything(predicate, data)
    assert(Values.isBool(ok))
    if (Values.isFalse(ok)) {
      let message = `[applyDataPutter] result data cannot possibly pass data predicate`
      message += formatUnderTag(2, `putter:`, prettyValue(maxWidth, putter))
      message += formatUnderTag(
        2,
        `putting value:`,
        prettyValue(maxWidth, value),
      )
      message += formatUnderTag(2, `result data:`, prettyValue(maxWidth, data))
      message += formatUnderTag(
        2,
        `data predicate:`,
        prettyValue(maxWidth, predicate),
      )
      throw new Error(message)
    }
  }

  return data
}
