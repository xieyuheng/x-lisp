import { formatValue } from "../format/index.ts"
import type { Value } from "./index.ts"
import * as Values from "./index.ts"

export function isInt(value: Value): value is Values.Int {
  return value.kind === "Int"
}

export function isFloat(value: Value): value is Values.Float {
  return value.kind === "Float"
}

export function asInt(value: Value): Values.Int {
  if (isInt(value)) return value
  throw new Error(`[asInt] fail on: ${formatValue(value)}`)
}

export function asFloat(value: Value): Values.Float {
  if (isFloat(value)) return value
  throw new Error(`[asFloat] fail on: ${formatValue(value)}`)
}
