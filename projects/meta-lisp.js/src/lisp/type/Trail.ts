import * as L from "../index.ts"

export type TrailEntry = { lhs: L.Value; rhs: L.Value }
export type Trail = Array<TrailEntry>

export function trailAdd(trail: Trail, lhs: L.Value, rhs: L.Value): Trail {
  return [...trail, { lhs, rhs }]
}

export function trailSome(
  trail: Trail,
  callback: (entry: TrailEntry) => boolean,
): boolean {
  return trail.some(callback)
}
