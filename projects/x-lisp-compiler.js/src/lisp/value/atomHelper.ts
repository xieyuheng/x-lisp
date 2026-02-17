import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type AtomValue, type Value } from "./index.ts"

export function isAtomValue(value: any): value is AtomValue {
  return (
    value.kind === "Hashtag" ||
    value.kind === "Symbol" ||
    value.kind === "String" ||
    value.kind === "Int" ||
    value.kind === "Float"
  )
}

export function isHashtagValue(value: Value): value is Values.HashtagValue {
  return value.kind === "Hashtag"
}

export function isSymbolValue(value: Value): value is Values.SymbolValue {
  return value.kind === "Symbol"
}

export function isStringValue(value: Value): value is Values.StringValue {
  return value.kind === "String"
}

export function isIntValue(value: Value): value is Values.IntValue {
  return value.kind === "Int"
}

export function isFloatValue(value: Value): value is Values.FloatValue {
  return value.kind === "Float"
}

export function asHashtagValue(value: Value): Values.HashtagValue {
  if (isHashtagValue(value)) return value
  throw new Error(`[asHashtag] fail on: ${formatValue(value)}`)
}

export function asSymbolValue(value: Value): Values.SymbolValue {
  if (isSymbolValue(value)) return value
  throw new Error(`[asSymbol] fail on: ${formatValue(value)}`)
}

export function asStringValue(value: Value): Values.StringValue {
  if (isStringValue(value)) return value
  throw new Error(`[asString] fail on: ${formatValue(value)}`)
}

export function asIntValue(value: Value): Values.IntValue {
  if (isIntValue(value)) return value
  throw new Error(`[asInt] fail on: ${formatValue(value)}`)
}

export function asFloatValue(value: Value): Values.FloatValue {
  if (isFloatValue(value)) return value
  throw new Error(`[asFloat] fail on: ${formatValue(value)}`)
}
