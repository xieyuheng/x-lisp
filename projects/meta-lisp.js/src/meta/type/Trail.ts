import * as M from "../index.ts"

export type TrailEntry = { lhs: M.Value; rhs: M.Value }
export type Trail = Array<TrailEntry>

export function trailAdd(trail: Trail, lhs: M.Value, rhs: M.Value): Trail {
  return [...trail, { lhs, rhs }]
}

export function trailSome(
  trail: Trail,
  callback: (entry: TrailEntry) => boolean,
): boolean {
  return trail.some(callback)
}
