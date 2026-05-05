import * as S from "../index.ts"

export function asList(sexp: S.Sexp): S.List {
  if (sexp.kind === "List") return sexp
  throw new Error(`[asList] fail on: ${S.formatSexp(sexp)}`)
}

export function isList(sexp: S.Sexp): sexp is S.List {
  return sexp.kind === "List"
}

export function Cons(head: S.Sexp, tail: S.Sexp): S.List {
  if (tail.kind !== "List") {
    throw new Error(`[Cons] tail to be a list, tail kind: ${tail.kind}.`)
  }

  return S.List([head, ...tail.elements], tail.location)
}
