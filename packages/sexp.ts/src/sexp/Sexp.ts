import * as S from "../index.ts"

export type Sexp = AtomSexp | ListSexp

export type AtomSexp = SymbolSexp | StringSexp | IntSexp | FloatSexp

export type SymbolSexp = {
  kind: "SymbolSexp"
  content: string
  location: S.SourceLocation
}

export function SymbolSexp(
  content: string,
  location: S.SourceLocation,
): SymbolSexp {
  return {
    kind: "SymbolSexp",
    content,
    location,
  }
}

export function isSymbolSexp(sexp: Sexp): sexp is SymbolSexp {
  return sexp.kind === "SymbolSexp"
}

export function asSymbolSexp(sexp: Sexp): SymbolSexp {
  if (isSymbolSexp(sexp)) return sexp
  let message = `[asSymbolSexp] fail on: ${S.formatSexp(sexp)}`
  throw new S.ErrorWithSourceLocation(message, sexp.location)
}

export type StringSexp = {
  kind: "StringSexp"
  content: string
  location: S.SourceLocation
}

export function StringSexp(
  content: string,
  location: S.SourceLocation,
): StringSexp {
  return {
    kind: "StringSexp",
    content,
    location,
  }
}

export function isStringSexp(sexp: Sexp): sexp is StringSexp {
  return sexp.kind === "StringSexp"
}

export function asStringSexp(sexp: Sexp): StringSexp {
  if (isStringSexp(sexp)) return sexp
  let message = `[asStringSexp] fail on: ${S.formatSexp(sexp)}`
  throw new S.ErrorWithSourceLocation(message, sexp.location)
}

export type IntSexp = {
  kind: "IntSexp"
  content: bigint
  location: S.SourceLocation
}

export function IntSexp(content: bigint, location: S.SourceLocation): IntSexp {
  return {
    kind: "IntSexp",
    content,
    location,
  }
}

export function isIntSexp(sexp: Sexp): sexp is IntSexp {
  return sexp.kind === "IntSexp"
}

export function asIntSexp(sexp: Sexp): IntSexp {
  if (isIntSexp(sexp)) return sexp
  let message = `[asIntSexp] fail on: ${S.formatSexp(sexp)}`
  throw new S.ErrorWithSourceLocation(message, sexp.location)
}

export type FloatSexp = {
  kind: "FloatSexp"
  content: number
  location: S.SourceLocation
}

export function FloatSexp(
  content: number,
  location: S.SourceLocation,
): FloatSexp {
  return {
    kind: "FloatSexp",
    content,
    location,
  }
}

export function isFloatSexp(sexp: Sexp): sexp is FloatSexp {
  return sexp.kind === "FloatSexp"
}

export function asFloatSexp(sexp: Sexp): FloatSexp {
  if (isFloatSexp(sexp)) return sexp
  let message = `[asFloatSexp] fail on: ${S.formatSexp(sexp)}`
  throw new S.ErrorWithSourceLocation(message, sexp.location)
}

export type ListSexp = {
  kind: "ListSexp"
  elements: Array<Sexp>
  location: S.SourceLocation
}

export function ListSexp(
  elements: Array<Sexp>,
  location: S.SourceLocation,
): ListSexp {
  return {
    kind: "ListSexp",
    elements,
    location,
  }
}

export function isListSexp(sexp: Sexp): sexp is ListSexp {
  return sexp.kind === "ListSexp"
}

export function asListSexp(sexp: Sexp): ListSexp {
  if (isListSexp(sexp)) return sexp
  let message = `[asListSexp] fail on: ${S.formatSexp(sexp)}`
  throw new S.ErrorWithSourceLocation(message, sexp.location)
}
