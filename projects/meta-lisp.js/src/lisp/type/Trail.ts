import * as L from "../index.ts"

export type Trail = Array<[L.Value, L.Value]>

export function trailLoopOccurred(
  trail: Trail,
  lhs: L.Value,
  rhs: L.Value,
): boolean {
  for (const entry of trail) {
    if (L.valueEqual(entry[0], lhs) && L.valueEqual(entry[1], rhs)) return true
  }

  return false
}
