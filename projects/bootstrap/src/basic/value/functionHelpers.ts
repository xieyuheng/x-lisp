import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isFunction(value: Value): value is Values.Function {
  return value.kind === "Function"
}

export function isCurry(value: Value): value is Values.Curry {
  return value.kind === "Curry"
}

export function asFunction(value: Value): Values.Function {
  if (isFunction(value)) return value
  throw new Error(`[asFunction] fail on: ${formatValue(value)}`)
}

export function asCurry(value: Value): Values.Curry {
  if (isCurry(value)) return value
  throw new Error(`[asCurry] fail on: ${formatValue(value)}`)
}
