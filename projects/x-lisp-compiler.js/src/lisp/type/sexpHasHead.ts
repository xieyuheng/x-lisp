import * as L from "../index.ts"

export function sexpHasHead(sexp: L.Value, head: L.Value): boolean {
  if (sexp.kind !== "TaelValue") return false
  const { elements } = L.asTaelValue(sexp)
  if (elements.length < 1) return false
  if (!L.equal(elements[0], head)) return false
  return true
}
