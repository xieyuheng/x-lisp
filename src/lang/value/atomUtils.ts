import * as Values from "../value/index.ts"
import { type Atom, type Value } from "../value/index.ts"

export function isAtom(value: any): value is Atom {
  return (
    value.kind === "Bool" ||
    value.kind === "Symbol" ||
    value.kind === "String" ||
    value.kind === "Int" ||
    value.kind === "Float"
  )
}

export function isBool(value: Value): value is Values.Bool {
  return value.kind === "Bool"
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

export function asBool(value: Value): Values.Bool {
  if (isBool(value)) return value
  throw new Error(`[asBool] fail on: ${value.kind}`)
}

export function asSymbol(value: Value): Values.Symbol {
  if (isSymbol(value)) return value
  throw new Error(`[asSymbol] fail on: ${value.kind}`)
}

export function asString(value: Value): Values.String {
  if (isString(value)) return value
  throw new Error(`[asString] fail on: ${value.kind}`)
}

export function asInt(value: Value): Values.Int {
  if (isInt(value)) return value
  throw new Error(`[asInt] fail on: ${value.kind}`)
}

export function asFloat(value: Value): Values.Float {
  if (isFloat(value)) return value
  throw new Error(`[asFloat] fail on: ${value.kind}`)
}
