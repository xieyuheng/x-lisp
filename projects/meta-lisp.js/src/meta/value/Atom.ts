import { formatValue } from "../format/index.ts"
import type { Value } from "./Value.ts"

export type AtomValue =
  | IntValue
  | FloatValue
  | StringValue
  | SymbolValue
  | KeywordValue
  | BoolValue
  | VoidValue

export function isAtomValue(value: any): value is AtomValue {
  return (
    value.kind === "IntValue" ||
    value.kind === "FloatValue" ||
    value.kind === "StringValue" ||
    value.kind === "KeywordValue" ||
    value.kind === "SymbolValue" ||
    value.kind === "BoolValue" ||
    value.kind === "VoidValue"
  )
}

export type IntValue = {
  kind: "IntValue"
  content: bigint
}

export function IntValue(content: bigint): IntValue {
  return {
    kind: "IntValue",
    content,
  }
}

export function isIntValue(value: Value): value is IntValue {
  return value.kind === "IntValue"
}

export function asIntValue(value: Value): IntValue {
  if (isIntValue(value)) return value
  throw new Error(`[asIntValue] fail on: ${formatValue(value)}`)
}

export type FloatValue = {
  kind: "FloatValue"
  content: number
}

export function FloatValue(content: number): FloatValue {
  return {
    kind: "FloatValue",
    content,
  }
}

export function isFloatValue(value: Value): value is FloatValue {
  return value.kind === "FloatValue"
}

export function asFloatValue(value: Value): FloatValue {
  if (isFloatValue(value)) return value
  throw new Error(`[asFloatValue] fail on: ${formatValue(value)}`)
}

export type StringValue = {
  kind: "StringValue"
  content: string
}

export function StringValue(content: string): StringValue {
  return {
    kind: "StringValue",
    content,
  }
}

export function isStringValue(value: Value): value is StringValue {
  return value.kind === "StringValue"
}

export function asStringValue(value: Value): StringValue {
  if (isStringValue(value)) return value
  throw new Error(`[asStringValue] fail on: ${formatValue(value)}`)
}

export type SymbolValue = {
  kind: "SymbolValue"
  content: string
}

export function SymbolValue(content: string): SymbolValue {
  return {
    kind: "SymbolValue",
    content,
  }
}

export function isSymbolValue(value: Value): value is SymbolValue {
  return value.kind === "SymbolValue"
}

export function asSymbolValue(value: Value): SymbolValue {
  if (isSymbolValue(value)) return value
  throw new Error(`[asSymbolValue] fail on: ${formatValue(value)}`)
}

export type KeywordValue = {
  kind: "KeywordValue"
  content: string
}

export function KeywordValue(content: string): KeywordValue {
  return {
    kind: "KeywordValue",
    content,
  }
}

export function isKeywordValue(value: Value): value is KeywordValue {
  return value.kind === "KeywordValue"
}

export function asKeywordValue(value: Value): KeywordValue {
  if (isKeywordValue(value)) return value
  throw new Error(`[asKeywordValue] fail on: ${formatValue(value)}`)
}

export type BoolValue = {
  kind: "BoolValue"
  content: boolean
}

export function BoolValue(content: boolean): BoolValue {
  return {
    kind: "BoolValue",
    content,
  }
}

export function isBoolValue(value: Value): value is BoolValue {
  return value.kind === "BoolValue"
}

export function isTrueValue(value: Value): boolean {
  return isBoolValue(value) && value.content === true
}

export function isFalseValue(value: Value): boolean {
  return isBoolValue(value) && value.content === false
}

export function asBoolValue(value: Value): BoolValue {
  if (isBoolValue(value)) return value
  throw new Error(`[asBoolValue] fail on: ${formatValue(value)}`)
}

export type VoidValue = {
  kind: "VoidValue"
  content: undefined
}

export function VoidValue(): VoidValue {
  return {
    kind: "VoidValue",
    content: undefined,
  }
}

export function isVoidValue(value: Value): value is VoidValue {
  return value.kind === "VoidValue"
}
