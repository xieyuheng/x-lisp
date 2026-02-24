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

  if (typeEquivalent([], lhs, rhs)) {
    return
  }

  if (L.isAnyType(rhs)) {
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
    typeSubtypeMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )

    const lhsRecord = L.tauTypeAttributeTypes(lhs)
    const rhsRecord = L.tauTypeAttributeTypes(rhs)
    // rhs has less keys
    for (const k of Object.keys(rhsRecord)) {
      typeSubtype(trail, lhsRecord[k], rhsRecord[k])
    }

    return
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    // contravariant
    typeSubtypeMany(trail, L.arrowTypeArgTypes(rhs), L.arrowTypeArgTypes(lhs))
    typeSubtype(trail, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    return
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    typeSubtype(trail, L.listTypeElementType(lhs), L.listTypeElementType(rhs))
    return
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    typeSubtype(trail, L.setTypeElementType(lhs), L.setTypeElementType(rhs))
    return
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    typeSubtype(trail, L.recordTypeValueType(lhs), L.recordTypeValueType(rhs))
    return
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    // key type is invariant
    typeEquivalent([], L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs))
    typeSubtype(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
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
    const lhsRecord = lhs.types
    const rhsRecord = rhs.types
    // lhs has less keys
    for (const k of Object.keys(lhsRecord)) {
      typeSubtype(trail, lhsRecord[k], rhsRecord[k])
    }

    return
  }

  if (rhs.kind === "DisjointUnionValue") {
    for (const variantType of Object.values(rhs.types)) {
      if (!willThrow(() => typeSubtype(trail, lhs, variantType))) {
        return
      }
    }
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
