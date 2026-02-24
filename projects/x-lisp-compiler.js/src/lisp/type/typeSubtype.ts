import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"
import { trailLoopOccurred, type Trail } from "./Trail.ts"
import { typeEquivalent } from "./typeEquivalent.ts"
import { unfoldDatatypeValue } from "./unfoldDatatypeValue.ts"

export function typeSubtype(trail: Trail, lhs: L.Value, rhs: L.Value): boolean {
  if (trailLoopOccurred(trail, lhs, rhs)) {
    return true
  }

  if (typeEquivalent([], lhs, rhs)) {
    return true
  }

  if (L.isAnyType(rhs)) {
    return true
  }

  if (L.isLiteralType(lhs) && L.isLiteralType(rhs)) {
    return L.equal(lhs, rhs)
  }

  if (L.isAtomType(lhs) && L.isAtomType(rhs)) {
    return L.atomTypeName(lhs) === L.atomTypeName(rhs)
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    if (
      !typeSubtypeMany(
        trail,
        L.tauTypeElementTypes(lhs),
        L.tauTypeElementTypes(rhs),
      )
    ) {
      return false
    }

    const lhsRecord = L.tauTypeAttributeTypes(lhs)
    const rhsRecord = L.tauTypeAttributeTypes(rhs)
    // rhs has less keys
    for (const k of Object.keys(rhsRecord)) {
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) {
        return false
      }
    }

    return true
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    // contravariant on ArgTypes
    return (
      typeSubtypeMany(
        trail,
        L.arrowTypeArgTypes(rhs),
        L.arrowTypeArgTypes(lhs),
      ) && typeSubtype(trail, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    )
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return typeSubtype(
      trail,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return typeSubtype(
      trail,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    return typeSubtype(
      trail,
      L.recordTypeValueType(lhs),
      L.recordTypeValueType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    // key type is invariant
    return (
      typeEquivalent([], L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs)) &&
      typeSubtype(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    )
  }

  if (lhs.kind === "DatatypeValue" && rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(
      trail,
      unfoldDatatypeValue(lhs),
      unfoldDatatypeValue(rhs),
    )
  }

  if (lhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, unfoldDatatypeValue(lhs), rhs)
  }

  if (rhs.kind === "DatatypeValue") {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, lhs, unfoldDatatypeValue(rhs))
  }

  if (lhs.kind === "DisjointUnionValue" && rhs.kind === "DisjointUnionValue") {
    const lhsRecord = lhs.types
    const rhsRecord = rhs.types
    // lhs has less keys
    for (const k of Object.keys(lhsRecord)) {
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) {
        return false
      }
    }

    return true
  }

  if (rhs.kind === "DisjointUnionValue") {
    for (const variantType of Object.values(rhs.types)) {
      if (typeSubtype(trail, lhs, variantType)) {
        return true
      }
    }
  }

  return false
}

function typeSubtypeMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => typeSubtype(trail, l, r))
  )
}
