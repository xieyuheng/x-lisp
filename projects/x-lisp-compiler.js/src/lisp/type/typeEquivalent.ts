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

  if (L.isAnyType(lhs) && L.isAnyType(rhs)) {
    assert(L.equal(lhs, rhs))
    return
  }

  if (L.isLiteralType(lhs) && L.isLiteralType(rhs)) {
    assert(L.equal(lhs, rhs))
    return
  }

  if (L.isAtomType(lhs) && L.isAtomType(rhs)) {
    assert(L.atomTypeName(lhs) === L.atomTypeName(rhs))
    return
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    typeEquivalentMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
    typeEquivalentRecord(
      trail,
      L.tauTypeAttributeTypes(lhs),
      L.tauTypeAttributeTypes(rhs),
    )
    return
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    typeEquivalentMany(
      trail,
      L.arrowTypeArgTypes(lhs),
      L.arrowTypeArgTypes(rhs),
    )
    typeEquivalent(trail, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    return
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    typeEquivalent(
      trail,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
    return
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    typeEquivalent(trail, L.setTypeElementType(lhs), L.setTypeElementType(rhs))
    return
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    typeEquivalent(
      trail,
      L.recordTypeValueType(lhs),
      L.recordTypeValueType(rhs),
    )
    return
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    typeEquivalent(trail, L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs))
    typeEquivalent(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
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
    typeEquivalentRecord(trail, lhs.types, rhs.types)
    return
  }

  let message = `[typeEquivalent] unhandled lhs and rhs`
  message += `\n  lhs: ${L.formatValue(lhs)}`
  message += `\n  rhs: ${L.formatValue(rhs)}`
  throw new Error(message)
}

function typeEquivalentMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): void {
  assert(lhs.length === rhs.length)
  arrayZip(lhs, rhs).forEach(([l, r]) => typeEquivalent(trail, l, r))
}

function typeEquivalentRecord(
  trail: Trail,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): void {
  if (Object.values(lhs).length !== Object.values(rhs).length) {
    assert(false)
  }

  for (const k of Object.keys(lhs)) {
    typeEquivalent(trail, lhs[k], rhs[k])
  }
}
