import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isBoolValue(value: Value): value is Values.BoolValue {
  return value.kind === "BoolValue"
}

export function isTrueValue(value: Value): boolean {
  return isBoolValue(value) && value.content === true
}

export function isFalseValue(value: Value): boolean {
  return isBoolValue(value) && value.content === false
}

export function asBoolValue(value: Value): Values.BoolValue {
  if (isBoolValue(value)) return value
  throw new Error(`[asBoolValue] fail on: ${formatValue(value)}`)
}

export function isVoidValue(value: Value): value is Values.VoidValue {
  return value.kind === "VoidValue"
}

export function isListValue(value: Value): value is Values.ListValue {
  return value.kind === "ListValue"
}

export function asListValue(value: Value): Values.ListValue {
  if (isListValue(value)) return value
  throw new Error(`[asListValue] fail on: ${formatValue(value)}`)
}

export function isRecordValue(value: Value): value is Values.RecordValue {
  return value.kind === "RecordValue"
}

export function asRecordValue(value: Value): Values.RecordValue {
  if (isRecordValue(value)) return value
  throw new Error(`[asRecordValue] fail on: ${formatValue(value)}`)
}

export function isClosureValue(value: Value): value is Values.ClosureValue {
  return value.kind === "ClosureValue"
}

export function asClosureValue(value: Value): Values.ClosureValue {
  if (isClosureValue(value)) return value
  throw new Error(`[asClosureValue] fail on: ${formatValue(value)}`)
}
