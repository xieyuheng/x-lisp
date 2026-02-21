import { arrayZip } from "@xieyuheng/helpers.js/array"
import assert from "node:assert"
import * as L from "../index.ts"
import { trailLoopOccurred, type Trail } from "./Trail.ts"
import { unfoldDatatypeValue } from "./unfoldDatatypeValue.ts"

export function typeEquivalent(trail: Trail, lhs: L.Value, rhs: L.Value): void {
  assert(L.isType(lhs))
  assert(L.isType(rhs))

  if (trailLoopOccurred(trail, lhs, rhs)) {
    return
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    typeEquivalentMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
    typeEquivalentManyAttributes(
      trail,
      L.tauTypeAttributeTypes(lhs),
      L.tauTypeAttributeTypes(rhs),
    )
    return
  }

  if (lhs.kind === "DatatypeValue" && rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs], [rhs, lhs]]
    typeEquivalent(trail, unfoldDatatypeValue(lhs), unfoldDatatypeValue(rhs))
    return
  }

  if (lhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs], [rhs, lhs]]
    typeEquivalent(trail, unfoldDatatypeValue(lhs), rhs)
    return
  }

  if (rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs], [rhs, lhs]]
    typeEquivalent(trail, lhs, unfoldDatatypeValue(rhs))
    return
  }

  if (lhs.kind === "DisjointUnionValue" && rhs.kind === "DisjointUnionValue") {
    typeEquivalentManyAttributes(trail, lhs.types, rhs.types)
    return
  }

  if (!L.equal(lhs, rhs)) {
    let message = `[typeEquivalent] fail`
    message += `\n  lhs: ${L.formatValue(lhs)}`
    message += `\n  rhs: ${L.formatValue(rhs)}`
    throw new Error(message)
  }
}

function typeEquivalentMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): void {
  assert(lhs.length === rhs.length)
  arrayZip(lhs, rhs).forEach(([l, r]) => typeEquivalent(trail, l, r))
}

function typeEquivalentManyAttributes(
  trail: Trail,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): void {
  const leftValues = Object.values(lhs)
  const rightValues = Object.values(rhs)
  if (leftValues.length !== rightValues.length) {
    assert(false)
  }

  for (const k of Object.keys(lhs)) {
    const l = lhs[k]
    const r = rhs[k]

    typeEquivalent(trail, l, r)
  }
}
