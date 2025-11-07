import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isAtom(value: any): value is Values.Atom {
  return (
    value.kind === "Hashtag" ||
    value.kind === "Symbol" ||
    value.kind === "String" ||
    value.kind === "Int" ||
    value.kind === "Float"
  )
}

export function isHashtag(value: Value): value is Values.Hashtag {
  return value.kind === "Hashtag"
}

export function isInt(value: Value): value is Values.Int {
  return value.kind === "Int"
}

export function isFloat(value: Value): value is Values.Float {
  return value.kind === "Float"
}

export function asHashtag(value: Value): Values.Hashtag {
  if (isHashtag(value)) return value
  throw new Error(`[asHashtag] fail on: ${formatValue(value)}`)
}

export function asInt(value: Value): Values.Int {
  if (isInt(value)) return value
  throw new Error(`[asInt] fail on: ${formatValue(value)}`)
}

export function asFloat(value: Value): Values.Float {
  if (isFloat(value)) return value
  throw new Error(`[asFloat] fail on: ${formatValue(value)}`)
}
