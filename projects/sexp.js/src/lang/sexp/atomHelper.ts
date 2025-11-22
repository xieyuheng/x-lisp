import * as S from "./Sexp.ts"

export function isAtom(sexp: S.Sexp): sexp is S.Atom {
  return (
    sexp.kind === "Symbol" ||
    sexp.kind === "String" ||
    sexp.kind === "Int" ||
    sexp.kind === "Float" ||
    sexp.kind === "Hashtag"
  )
}

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

export function isHashtag(sexp: S.Sexp): sexp is S.Hashtag {
  return sexp.kind === "Hashtag"
}

export function asSymbol(sexp: S.Sexp): S.Symbol {
  if (sexp.kind === "Symbol") return sexp
  throw new Error(`[asSymbol] fail on: ${sexp.kind}`)
}

export function asString(sexp: S.Sexp): S.String {
  if (sexp.kind === "String") return sexp
  throw new Error(`[asString] fail on: ${sexp.kind}`)
}

export function asInt(sexp: S.Sexp): S.Int {
  if (sexp.kind === "Int") return sexp
  throw new Error(`[asInt] fail on: ${sexp.kind}`)
}

export function asFloat(sexp: S.Sexp): S.Float {
  if (sexp.kind === "Float") return sexp
  throw new Error(`[asFloat] fail on: ${sexp.kind}`)
}

export function asHashtag(sexp: S.Sexp): S.Hashtag {
  if (sexp.kind === "Hashtag") return sexp
  throw new Error(`[asHashtag] fail on: ${sexp.kind}`)
}
