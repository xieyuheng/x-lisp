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

export function asTaelValue(value: Value): Values.TaelValue {
  if (value.kind === "TaelValue") return value
  throw new Error(`[asTael] fail on: ${formatValue(value)}`)
}
