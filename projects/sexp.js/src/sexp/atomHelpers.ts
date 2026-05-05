import * as S from "../index.ts"

export function isSymbol(sexp: S.Sexp): sexp is S.Symbol {
  return sexp.kind === "Symbol"
}

export function isString(sexp: S.Sexp): sexp is S.String {
  return sexp.kind === "String"
}

export function isInt(sexp: S.Sexp): sexp is S.Int {
  return sexp.kind === "Int"
}

export function isFloat(sexp: S.Sexp): sexp is S.Float {
  return sexp.kind === "Float"
}

export function isKeyword(sexp: S.Sexp): sexp is S.Keyword {
  return sexp.kind === "Keyword"
}

export function asSymbol(sexp: S.Sexp): S.Symbol {
  if (sexp.kind === "Symbol") return sexp
  throw new Error(`[asSymbol] fail on: ${S.formatSexp(sexp)}`)
}

export function asString(sexp: S.Sexp): S.String {
  if (sexp.kind === "String") return sexp
  throw new Error(`[asString] fail on: ${S.formatSexp(sexp)}`)
}

export function asInt(sexp: S.Sexp): S.Int {
  if (sexp.kind === "Int") return sexp
  throw new Error(`[asInt] fail on: ${S.formatSexp(sexp)}`)
}

export function asFloat(sexp: S.Sexp): S.Float {
  if (sexp.kind === "Float") return sexp
  throw new Error(`[asFloat] fail on: ${S.formatSexp(sexp)}`)
}

export function asKeyword(sexp: S.Sexp): S.Keyword {
  if (sexp.kind === "Keyword") return sexp
  throw new Error(`[asKeyword] fail on: ${S.formatSexp(sexp)}`)
}
