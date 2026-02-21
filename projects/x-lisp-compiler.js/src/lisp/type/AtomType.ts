import * as L from "../index.ts"

export function isAtomType(value: L.Value): boolean {
  if (!L.isTaelValue(value)) return false

  return true
}
