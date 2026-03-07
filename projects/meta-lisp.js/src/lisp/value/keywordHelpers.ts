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

export function NullValue(): Values.KeywordValue {
  return {
    kind: "KeywordValue",
    content: "null",
  }
}

export function isNullValue(value: Value): boolean {
  return value.kind === "KeywordValue" && value.content === "null"
}
