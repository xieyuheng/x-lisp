import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import assert from "node:assert"
import { textWidth } from "../../config.ts"
import { flags } from "../../flags.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { applyDataPredicateWithAnything } from "./applyDataPredicate.ts"

export function applyDataConstructor(
  constructor: Values.DataConstructor,
  args: Array<Value>,
): Value {
  const width = textWidth
  const data = Values.Data(constructor, args)

  if (flags.debug) {
    const predicate = constructor.spec.predicate
    const ok = applyDataPredicateWithAnything(predicate, data)
    assert(Values.isBoolValue(ok))
    if (Values.isFalseValue(ok)) {
      let message = `[applyDataConstructor] result data cannot possibly pass data predicate`
      message += formatUnderTag(
        2,
        `constructor:`,
        prettyValue(width, constructor),
      )
      message += formatUnderTag(2, `args:`, prettyValues(width, args))
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
