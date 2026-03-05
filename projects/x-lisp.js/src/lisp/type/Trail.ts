import * as L from "../index.ts"

export type Trail = Array<[L.Value, L.Value]>

export function trailLoopOccurred(
  trail: Trail,
  lhs: L.Value,
  rhs: L.Value,
): boolean {
  for (const entry of trail) {
    if (L.equal(entry[0], lhs) && L.equal(entry[1], rhs)) return true
  }

  return false
}
