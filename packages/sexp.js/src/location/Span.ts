import { type Position } from "./Position.ts"

export type Span = {
  start: Position
  end: Position
}

export function spanUnion(lhs: Span, rhs: Span): Span {
  const start = lhs.start.index < rhs.start.index ? lhs.start : rhs.start
  const end = lhs.end.index > rhs.end.index ? lhs.end : rhs.end
  return { start, end }
}
