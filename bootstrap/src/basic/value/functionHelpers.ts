import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isFunctionRef(value: Value): value is Values.FunctionRef {
  return value.kind === "FunctionRef"
}

export function isPrimitiveFunctionRef(
  value: Value,
): value is Values.PrimitiveFunctionRef {
  return value.kind === "PrimitiveFunctionRef"
}

export function isCurry(value: Value): value is Values.Curry {
  return value.kind === "Curry"
}

export function asFunctionRef(value: Value): Values.FunctionRef {
  if (isFunctionRef(value)) return value
  throw new Error(`[asFunctionRef] fail on: ${formatValue(value)}`)
}

export function asPrimitiveFunctionRef(
  value: Value,
): Values.PrimitiveFunctionRef {
  if (isPrimitiveFunctionRef(value)) return value
  throw new Error(`[asPrimitiveFunctionRef] fail on: ${formatValue(value)}`)
}

export function asCurry(value: Value): Values.Curry {
  if (isCurry(value)) return value
  throw new Error(`[asCurry] fail on: ${formatValue(value)}`)
}
