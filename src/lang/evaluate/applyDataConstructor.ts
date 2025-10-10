import assert from "node:assert"
import { flags } from "../../flags.ts"
import { globals } from "../../globals.ts"
import { formatUnderTag } from "../../helper/format/formatUnderTag.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import type { Value } from "../value/index.ts"
import * as Values from "../value/index.ts"
import { applyDataPredicateWithAnything } from "./applyDataPredicate.ts"

export function applyDataConstructor(
  constructor: Values.DataConstructor,
  args: Array<Value>,
): Value {
  const maxWidth = globals.maxWidth
  const data = Values.Data(constructor, args)

  if (flags.debug) {
    const predicate = constructor.spec.predicate
    const ok = applyDataPredicateWithAnything(predicate, data)
    assert(Values.isBool(ok))
    if (Values.isFalse(ok)) {
      let message = `[applyDataConstructor] result data cannot possibly pass data predicate`
      message += formatUnderTag(
        2,
        `constructor:`,
        prettyValue(maxWidth, constructor),
      )
      message += formatUnderTag(2, `args:`, prettyValues(maxWidth, args))
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
