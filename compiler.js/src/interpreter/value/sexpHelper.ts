import { isAtom } from "./atomHelper.ts"
import { type Value } from "./Value.ts"

export function isSexp(value: Value): boolean {
  if (isAtom(value)) return true

  if (value.kind === "Tael") {
    return (
      value.elements.every(isSexp) &&
      Object.values(value.attributes).every(isSexp)
    )
  }

  return false
}
