import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function Data(
  constructor: Values.DataConstructor,
  elements: Array<Value>,
): Value {
  return Values.ListValue([Values.HashtagValue(constructor.name), ...elements])
}

export function isData(value: Value): value is Values.TaelValue {
  if (value.kind !== "Tael") return false
  if (value.elements.length === 0) return false
  const head = value.elements[0]
  return head.kind === "Hashtag"
}

export function dataHashtag(value: Value): Values.HashtagValue {
  if (!isData(value)) {
    let message = `[dataHashtag] expect value to be data`
    message += `\n  value: ${formatValue(value)}`
    throw new Error(message)
  }

  return value.elements[0] as Values.HashtagValue
}
