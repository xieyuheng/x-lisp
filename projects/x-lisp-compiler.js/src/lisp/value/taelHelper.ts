import { formatValue } from "../format/index.ts"
import * as Values from "./Value.ts"
import { type Value } from "./Value.ts"

export function ListValue(elements: Array<Value>): Values.TaelValue {
  return {
    kind: "Tael",
    elements,
    attributes: {},
  }
}

export function RecordValue(attributes: Values.Attributes): Values.TaelValue {
  return {
    kind: "Tael",
    elements: [],
    attributes,
  }
}

export function asTaelValue(value: Value): Values.TaelValue {
  if (value.kind === "Tael") return value
  throw new Error(`[asTael] fail on: ${formatValue(value)}`)
}
