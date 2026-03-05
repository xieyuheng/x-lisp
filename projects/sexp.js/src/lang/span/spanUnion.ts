import { type Span } from "./Span.ts"

export function spanUnion(x: Span, y: Span): Span {
  const start = x.start.index < y.start.index ? x.start : y.start
  const end = x.end.index > y.end.index ? x.end : y.end
  return { start, end }
}
