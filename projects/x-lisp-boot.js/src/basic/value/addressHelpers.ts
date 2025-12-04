import { formatValue } from "../format/index.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isAddress(value: Value): value is Values.Address {
  return value.kind === "Address"
}

export function asAddress(value: Value): Values.Address {
  if (isAddress(value)) return value
  throw new Error(`[asAddress] fail on: ${formatValue(value)}`)
}
