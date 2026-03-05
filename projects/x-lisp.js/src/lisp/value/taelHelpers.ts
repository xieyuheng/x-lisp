import { formatValue } from "../format/index.ts"
import * as Values from "./Value.ts"
import { type Value } from "./Value.ts"

export function ListValue(elements: Array<Value>): Values.TaelValue {
  return Values.TaelValue(elements, {})
}

export function RecordValue(
  attributes: Record<string, Value>,
): Values.TaelValue {
  return Values.TaelValue([], attributes)
}

export function isTaelValue(value: Value): value is Values.TaelValue {
  return value.kind === "TaelValue"
}

export function asTaelValue(value: Value): Values.TaelValue {
  if (isTaelValue(value)) return value
  throw new Error(`[asTaelValue] fail on: ${formatValue(value)}`)
}
