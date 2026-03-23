import { formatValue } from "../format/index.ts"
import * as Values from "./Value.ts"
import { type Value } from "./Value.ts"

export function isDefinitionValue(
  value: Value,
): value is Values.DefinitionValue {
  return value.kind === "DefinitionValue"
}

export function asDefinitionValue(value: Value): Values.DefinitionValue {
  if (isDefinitionValue(value)) return value
  throw new Error(`[asDefinitionValue] fail on: ${formatValue(value)}`)
}
