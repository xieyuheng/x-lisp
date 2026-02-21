import { arrayZip } from "@xieyuheng/helpers.js/array"
import assert from "node:assert"
import * as L from "../index.ts"
import { trailLoopOccurred, type Trail } from "./Trail.ts"
import { typeEquivalent } from "./typeEquivalent.ts"
import { unfoldDatatypeValue } from "./unfoldDatatypeValue.ts"

function willThrow(fn: () => void) {
  try {
    fn()
    return false
  } catch (_) {
    return true
  }
}

export function typeSubtype(trail: Trail, lhs: L.Value, rhs: L.Value): void {
  assert(L.isType(lhs))
  assert(L.isType(rhs))

  if (trailLoopOccurred(trail, lhs, rhs)) {
    return
  }

  if (!willThrow(() => typeEquivalent(trail, lhs, rhs))) {
    return
  }

  if (L.isLiteralType(lhs) && L.isLiteralType(rhs)) {
    assert(L.equal(lhs, rhs))
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    typeSubtypeMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
    typeSubtypeManyAttributes(
      trail,
      L.tauTypeAttributeTypes(lhs),
      L.tauTypeAttributeTypes(rhs),
    )
    return
  }

  if (lhs.kind === "DatatypeValue" && rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]
    typeSubtype(trail, unfoldDatatypeValue(lhs), unfoldDatatypeValue(rhs))
    return
  }

  if (lhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]
    typeSubtype(trail, unfoldDatatypeValue(lhs), rhs)
    return
  }

  if (rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]
    typeSubtype(trail, lhs, unfoldDatatypeValue(rhs))
    return
  }

  if (lhs.kind === "DisjointUnionValue" && rhs.kind === "DisjointUnionValue") {
    typeSubtypeManyAttributes(trail, lhs.types, rhs.types)
    return
  }

  let message = `[typeSubtype] fail`
  message += `\n  lhs: ${L.formatValue(lhs)}`
  message += `\n  rhs: ${L.formatValue(rhs)}`
  throw new Error(message)
}

function typeSubtypeMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): void {
  assert(lhs.length === rhs.length)
  arrayZip(lhs, rhs).forEach(([l, r]) => typeSubtype(trail, l, r))
}

function typeSubtypeManyAttributes(
  trail: Trail,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): void {
  for (const k of Object.keys(lhs)) {
    typeSubtype(trail, lhs[k], rhs[k])
  }
}
