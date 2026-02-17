import { isAtomValue } from "./atomHelper.ts"
import { type Value } from "./Value.ts"

export function isSexpValue(value: Value): boolean {
  if (isAtomValue(value)) return true

  if (value.kind === "Tael") {
    return (
      value.elements.every(isSexpValue) &&
      Object.values(value.attributes).every(isSexpValue)
    )
  }

  return false
}
