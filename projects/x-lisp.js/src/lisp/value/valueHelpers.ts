import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isListValue(value: Value): value is Values.ListValue {
  return value.kind === "ListValue"
}

export function asListValue(value: Value): Values.ListValue {
  if (isListValue(value)) return value
  throw new Error(`[asListValue] fail on: ${formatValue(value)}`)
}

export function isObjectValue(value: Value): value is Values.ObjectValue {
  return value.kind === "ObjectValue"
}

export function asObjectValue(value: Value): Values.ObjectValue {
  if (isObjectValue(value)) return value
  throw new Error(`[asObjectValue] fail on: ${formatValue(value)}`)
}

export function isClosureValue(value: Value): value is Values.ClosureValue {
  return value.kind === "ClosureValue"
}

export function asClosureValue(value: Value): Values.ClosureValue {
  if (isClosureValue(value)) return value
  throw new Error(`[asClosureValue] fail on: ${formatValue(value)}`)
}
