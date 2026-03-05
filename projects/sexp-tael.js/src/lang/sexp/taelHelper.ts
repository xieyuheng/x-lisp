import * as S from "./Sexp.ts"

export function asTael(sexp: S.Sexp): S.Tael {
  if (sexp.kind === "Tael") return sexp
  throw new Error(`[asTael] fail on: ${sexp.kind}`)
}

export function isTael(sexp: S.Sexp): sexp is S.Tael {
  return sexp.kind === "Tael"
}

export function List(elements: Array<S.Sexp>, meta: S.Attributes = {}): S.Tael {
  return S.Tael(elements, {}, meta)
}

export function Record(
  attributes: S.Attributes,
  meta: S.Attributes = {},
): S.Tael {
  return S.Tael([], attributes, meta)
}

export function Cons(head: S.Sexp, tail: S.Sexp): S.Tael {
  if (tail.kind !== "Tael") {
    throw new Error(`[Cons] tail to be a list, tail kind: ${tail.kind}.`)
  }

  return S.Tael([head, ...tail.elements], tail.attributes, tail.meta)
}
