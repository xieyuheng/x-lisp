import * as L from "../index.ts"

export type Trail = Array<[L.Value, L.Value]>

export function trailAdd(trail: Trail, lhs: L.Value, rhs: L.Value): Trail {
  return [...trail, [lhs, rhs]]
}
