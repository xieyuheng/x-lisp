import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function BoolValue(bool: boolean): Values.KeywordValue {
  return {
    kind: "KeywordValue",
    content: bool ? "t" : "f",
  }
}

export function isBoolValue(value: Value): boolean {
  return isTrueValue(value) || isFalseValue(value)
}

export function isTrueValue(value: Value): boolean {
  return value.kind === "KeywordValue" && value.content === "t"
}

export function isFalseValue(value: Value): boolean {
  return value.kind === "KeywordValue" && value.content === "f"
}

export function asBoolValue(value: Value): Values.KeywordValue {
  if (isBoolValue(value)) return value as Values.KeywordValue
  throw new Error(`[asBoolValue] fail on: ${formatValue(value)}`)
}

export function VoidValue(): Values.KeywordValue {
  return {
    kind: "KeywordValue",
    content: "void",
  }
}

export function isVoidValue(value: Value): boolean {
  return value.kind === "KeywordValue" && value.content === "void"
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
