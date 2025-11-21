import { arrayZip } from "../../helpers/array/arrayZip.ts"
import type { Attributes, Sexp } from "./Sexp.ts"

export function sexpEqual(x: Sexp, y: Sexp): boolean {
  if (
    (x.kind === "Symbol" && y.kind === "Symbol") ||
    (x.kind === "String" && y.kind === "String") ||
    (x.kind === "Int" && y.kind === "Int") ||
    (x.kind === "Float" && y.kind === "Float") ||
    (x.kind === "Hashtag" && y.kind === "Hashtag")
  ) {
    return x.content === y.content
  }

  if (x.kind === "Tael" && y.kind === "Tael") {
    return (
      sexpArrayEqual(x.elements, y.elements) &&
      attributesEqual(x.attributes, y.attributes)
    )
  }

  return false
}

export function sexpArrayEqual(xs: Array<Sexp>, ys: Array<Sexp>): boolean {
  if (xs.length !== ys.length) return false
  for (const [x, y] of arrayZip(xs, ys)) {
    if (!sexpEqual(x, y)) return false
  }

  return true
}

export function attributesEqual(x: Attributes, y: Attributes): boolean {
  if (Object.keys(x).length !== Object.keys(y).length) return false

  for (const key of Object.keys(x)) {
    if (x[key] === undefined) return false
    if (y[key] === undefined) return false
    if (!sexpEqual(x[key], y[key])) return false
  }

  return true
}
