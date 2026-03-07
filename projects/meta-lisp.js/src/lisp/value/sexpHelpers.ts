import { isAtomValue } from "./atomHelpers.ts"
import { type Value } from "./Value.ts"

export function isSexpValue(value: Value): boolean {
  if (isAtomValue(value)) return true

  if (value.kind === "ListValue") {
    return value.elements.every(isSexpValue)
  }

  return false
}
