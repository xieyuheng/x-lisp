import { arrayZip } from "@xieyuheng/std.js/array"
import * as S from "../index.ts"

export function sexpEqual(x: S.Sexp, y: S.Sexp): boolean {
  if (
    (x.kind === "SymbolSexp" && y.kind === "SymbolSexp") ||
    (x.kind === "StringSexp" && y.kind === "StringSexp") ||
    (x.kind === "IntSexp" && y.kind === "IntSexp") ||
    (x.kind === "FloatSexp" && y.kind === "FloatSexp") ||
    (x.kind === "KeywordSexp" && y.kind === "KeywordSexp")
  ) {
    return x.content === y.content
  }

  if (x.kind === "ListSexp" && y.kind === "ListSexp") {
    return sexpEqualArray(x.elements, y.elements)
  }

  return false
}

export function sexpEqualArray(xs: Array<S.Sexp>, ys: Array<S.Sexp>): boolean {
  if (xs.length !== ys.length) return false
  for (const [x, y] of arrayZip(xs, ys)) {
    if (!sexpEqual(x, y)) return false
  }

  return true
}

export function sexpEqualRecord(
  x: Record<string, S.Sexp>,
  y: Record<string, S.Sexp>,
): boolean {
  if (Object.keys(x).length !== Object.keys(y).length) return false

  for (const key of Object.keys(x)) {
    if (x[key] === undefined) return false
    if (y[key] === undefined) return false
    if (!sexpEqual(x[key], y[key])) return false
  }

  return true
}
