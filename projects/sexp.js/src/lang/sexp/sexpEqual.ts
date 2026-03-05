import { arrayZip } from "@xieyuheng/helpers.js/array"
import type { Sexp } from "./Sexp.ts"

export function sexpEqual(x: Sexp, y: Sexp): boolean {
  if (
    (x.kind === "Symbol" && y.kind === "Symbol") ||
    (x.kind === "String" && y.kind === "String") ||
    (x.kind === "Int" && y.kind === "Int") ||
    (x.kind === "Float" && y.kind === "Float") ||
    (x.kind === "Keyword" && y.kind === "Keyword")
  ) {
    return x.content === y.content
  }

  if (x.kind === "List" && y.kind === "List") {
    return sexpEqualArray(x.elements, y.elements)
  }

  return false
}

export function sexpEqualArray(xs: Array<Sexp>, ys: Array<Sexp>): boolean {
  if (xs.length !== ys.length) return false
  for (const [x, y] of arrayZip(xs, ys)) {
    if (!sexpEqual(x, y)) return false
  }

  return true
}

export function sexpEqualRecord(
  x: Record<string, Sexp>,
  y: Record<string, Sexp>,
): boolean {
  if (Object.keys(x).length !== Object.keys(y).length) return false

  for (const key of Object.keys(x)) {
    if (x[key] === undefined) return false
    if (y[key] === undefined) return false
    if (!sexpEqual(x[key], y[key])) return false
  }

  return true
}
