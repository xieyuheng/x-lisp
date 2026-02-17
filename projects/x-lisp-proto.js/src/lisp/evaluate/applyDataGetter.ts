import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { textWidth } from "../../config.ts"
import { prettyValue, prettyValues } from "../pretty/index.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function applyDataGetter(
  getter: Values.DataGetter,
  args: Array<Value>,
): Value {
  const width = textWidth

  if (args.length !== 1) {
    let message = `[applyDataGetter] data getter can only take one argument`
    message += formatUnderTag(2, `getter:`, prettyValue(width, getter))
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  const data = args[0]

  if (!Values.isData(data)) {
    let message = `[applyDataGetter] data getter can only take data as argument`
    message += formatUnderTag(2, `getter:`, prettyValue(width, getter))
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  if (Values.dataHashtag(data).content !== getter.constructor.name) {
    let message = `[applyDataGetter] data getter constructor mismatch`
    message += formatUnderTag(2, `getter:`, prettyValue(width, getter))
    message += formatUnderTag(2, `args:`, prettyValues(width, args))
    throw new Error(message)
  }

  // index + 1 to pass the hashtag at the head.
  return Values.asTaelValue(data).elements[getter.fieldIndex + 1]
}
