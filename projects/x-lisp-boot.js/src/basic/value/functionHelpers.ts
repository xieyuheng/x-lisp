import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isFunction(value: Value): value is Values.FunctionRef {
  return value.kind === "FunctionRef"
}

export function asFunction(value: Value): Values.FunctionRef {
  if (isFunction(value)) return value
  throw new Error(`[asFunction] fail on: ${formatValue(value)}`)
}
