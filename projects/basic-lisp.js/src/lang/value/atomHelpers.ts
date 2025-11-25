import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Atom, type Value } from "./index.ts"

export function isAtom(value: any): value is Atom {
  return (
    value.kind === "Hashtag" ||
    value.kind === "Symbol" ||
    value.kind === "String" ||
    value.kind === "Int" ||
    value.kind === "Float" ||
    value.kind === "Undefined"
  )
}

export function isHashtag(value: Value): value is Values.Hashtag {
  return value.kind === "Hashtag"
}

export function isSymbol(value: Value): value is Values.Symbol {
  return value.kind === "Symbol"
}

export function isString(value: Value): value is Values.String {
  return value.kind === "String"
}

export function isInt(value: Value): value is Values.Int {
  return value.kind === "Int"
}

export function isFloat(value: Value): value is Values.Float {
  return value.kind === "Float"
}

export function isUndefined(value: Value): value is Values.Undefined {
  return value.kind === "Undefined"
}

export function asHashtag(value: Value): Values.Hashtag {
  if (isHashtag(value)) return value
  throw new Error(`[asHashtag] fail on: ${formatValue(value)}`)
}

export function asSymbol(value: Value): Values.Symbol {
  if (isSymbol(value)) return value
  throw new Error(`[asSymbol] fail on: ${formatValue(value)}`)
}

export function asString(value: Value): Values.String {
  if (isString(value)) return value
  throw new Error(`[asString] fail on: ${formatValue(value)}`)
}

export function asInt(value: Value): Values.Int {
  if (isInt(value)) return value
  throw new Error(`[asInt] fail on: ${formatValue(value)}`)
}

export function asFloat(value: Value): Values.Float {
  if (isFloat(value)) return value
  throw new Error(`[asFloat] fail on: ${formatValue(value)}`)
}

export function asUndefined(value: Value): Values.Undefined {
  if (isUndefined(value)) return value
  throw new Error(`[asUndefined] fail on: ${formatValue(value)}`)
}
