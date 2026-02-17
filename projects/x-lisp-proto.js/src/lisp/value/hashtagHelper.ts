import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function BoolValue(bool: boolean): Values.HashtagValue {
  return {
    kind: "Hashtag",
    content: bool ? "t" : "f",
  }
}

export function isBoolValue(value: Value): boolean {
  return isTrueValue(value) || isFalseValue(value)
}

export function isTrueValue(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "t"
}

export function isFalseValue(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "f"
}

export function asBoolValue(value: Value): Values.HashtagValue {
  if (isBoolValue(value)) return value as Values.HashtagValue
  throw new Error(`[asBool] fail on: ${formatValue(value)}`)
}

export function VoidValue(): Values.HashtagValue {
  return {
    kind: "Hashtag",
    content: "void",
  }
}

export function isVoidValue(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "void"
}

export function NullValue(): Values.HashtagValue {
  return {
    kind: "Hashtag",
    content: "null",
  }
}

export function isNullValue(value: Value): boolean {
  return value.kind === "Hashtag" && value.content === "null"
}
