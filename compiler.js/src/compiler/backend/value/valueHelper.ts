import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isBool(value: Value): value is Values.Bool {
  return value.kind === "Bool"
}

export function isTrue(value: Value): value is Values.Bool {
  return isBool(value) && value.content === true
}

export function isFalse(value: Value): value is Values.Bool {
  return isBool(value) && value.content === false
}

export function isVoid(value: Value): value is Values.Void {
  return value.kind === "Void"
}

export function isInt(value: Value): value is Values.Int {
  return value.kind === "Int"
}

export function isFloat(value: Value): value is Values.Float {
  return value.kind === "Float"
}

export function asBool(value: Value): Values.Bool {
  if (isBool(value)) return value
  throw new Error(`[asBool] fail on: ${formatValue(value)}`)
}

export function asVoid(value: Value): Values.Void {
  if (isVoid(value)) return value
  throw new Error(`[asVoid] fail on: ${formatValue(value)}`)
}

export function asInt(value: Value): Values.Int {
  if (isInt(value)) return value
  throw new Error(`[asInt] fail on: ${formatValue(value)}`)
}

export function asFloat(value: Value): Values.Float {
  if (isFloat(value)) return value
  throw new Error(`[asFloat] fail on: ${formatValue(value)}`)
}
