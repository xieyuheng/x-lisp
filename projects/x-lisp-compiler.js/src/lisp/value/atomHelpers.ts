import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type AtomValue, type Value } from "./index.ts"

export function isAtomValue(value: any): value is AtomValue {
  return (
    value.kind === "HashtagValue" ||
    value.kind === "SymbolValue" ||
    value.kind === "StringValue" ||
    value.kind === "IntValue" ||
    value.kind === "FloatValue"
  )
}

export function isHashtagValue(value: Value): value is Values.HashtagValue {
  return value.kind === "HashtagValue"
}

export function isSymbolValue(value: Value): value is Values.SymbolValue {
  return value.kind === "SymbolValue"
}

export function isStringValue(value: Value): value is Values.StringValue {
  return value.kind === "StringValue"
}

export function isIntValue(value: Value): value is Values.IntValue {
  return value.kind === "IntValue"
}

export function isFloatValue(value: Value): value is Values.FloatValue {
  return value.kind === "FloatValue"
}

export function asHashtagValue(value: Value): Values.HashtagValue {
  if (isHashtagValue(value)) return value
  throw new Error(`[asHashtagValue] fail on: ${formatValue(value)}`)
}

export function asSymbolValue(value: Value): Values.SymbolValue {
  if (isSymbolValue(value)) return value
  throw new Error(`[asSymbolValue] fail on: ${formatValue(value)}`)
}

export function asStringValue(value: Value): Values.StringValue {
  if (isStringValue(value)) return value
  throw new Error(`[asStringValue] fail on: ${formatValue(value)}`)
}

export function asIntValue(value: Value): Values.IntValue {
  if (isIntValue(value)) return value
  throw new Error(`[asIntValue] fail on: ${formatValue(value)}`)
}

export function asFloatValue(value: Value): Values.FloatValue {
  if (isFloatValue(value)) return value
  throw new Error(`[asFloatValue] fail on: ${formatValue(value)}`)
}
