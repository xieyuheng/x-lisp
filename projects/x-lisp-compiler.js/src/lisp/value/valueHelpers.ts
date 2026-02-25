import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isClosureValue(value: Value): value is Values.ClosureValue {
  return value.kind === "ClosureValue"
}

export function asClosureValue(value: Value): Values.ClosureValue {
  if (isClosureValue(value)) return value
  throw new Error(`[asClosureValue] fail on: ${formatValue(value)}`)
}
