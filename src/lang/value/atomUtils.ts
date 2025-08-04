import * as Values from "./Value.ts"
import { type Atom, type Value } from "./Value.ts"

export function isAtom(value: any): value is Atom {
  return (
    value.kind === "Bool" ||
    value.kind === "Symbol" ||
    value.kind === "String" ||
    value.kind === "Int" ||
    value.kind === "Float"
  )
}

export function asBool(value: Value): Values.Bool {
  if (value.kind === "Bool") return value
  throw new Error(`[asBool] fail on: ${value.kind}`)
}

export function asSymbol(value: Value): Values.Symbol {
  if (value.kind === "Symbol") return value
  throw new Error(`[asSymbol] fail on: ${value.kind}`)
}

export function asString(value: Value): Values.String {
  if (value.kind === "String") return value
  throw new Error(`[asString] fail on: ${value.kind}`)
}

export function asInt(value: Value): Values.Int {
  if (value.kind === "Int") return value
  throw new Error(`[asInt] fail on: ${value.kind}`)
}

export function asFloat(value: Value): Values.Float {
  if (value.kind === "Float") return value
  throw new Error(`[asFloat] fail on: ${value.kind}`)
}
