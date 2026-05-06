import * as S from "../index.ts"

export type SourceLocation = {
  path: string
  span: S.Span
}

export function createSourceLocation(
  path: string,
  span: S.Span,
): SourceLocation {
  return {
    path,
    span,
  }
}

export function sourceLocationUnion(
  lhs: SourceLocation,
  rhs: SourceLocation,
): SourceLocation {
  if (lhs.path !== rhs.path) {
    let message = `[sourceLocationUnion] location path mismatch`
    message += `\n  lhs path: ${lhs.path}`
    message += `\n  rhs path: ${rhs.path}`
    throw new S.ErrorWithSourceLocation(message, lhs)
  }

  return createSourceLocation(lhs.path, S.spanUnion(lhs.span, rhs.span))
}
