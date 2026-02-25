import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"
import { trailLoopOccurred, type Trail } from "./Trail.ts"
import { unfoldDatatypeType } from "./unfoldDatatypeType.ts"

export function typeEquivalent(
  trail: Trail,
  lhs: L.Value,
  rhs: L.Value,
): boolean {
  if (trailLoopOccurred(trail, lhs, rhs)) {
    return true
  }

  if (L.isVarType(lhs) && L.isVarType(rhs)) {
    // We assume unificaton and `substApplyToType` are performed on
    // `lhs` and `rhs`, before calling `typeEquivalent` and
    // `typeSubtype`.
    if (L.varTypeSerialNumber(lhs) === L.varTypeSerialNumber(rhs)) {
      return true
    } else {
      return false
    }
  }

  if (L.isAnyType(lhs) && L.isAnyType(rhs)) {
    return L.equal(lhs, rhs)
  }

  if (L.isLiteralType(lhs) && L.isLiteralType(rhs)) {
    return L.equal(lhs, rhs)
  }

  if (L.isAtomType(lhs) && L.isAtomType(rhs)) {
    return L.atomTypeName(lhs) === L.atomTypeName(rhs)
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    return (
      typeEquivalentMany(
        trail,
        L.tauTypeElementTypes(lhs),
        L.tauTypeElementTypes(rhs),
      ) &&
      typeEquivalentRecord(
        trail,
        L.tauTypeAttributeTypes(lhs),
        L.tauTypeAttributeTypes(rhs),
      )
    )
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    return (
      typeEquivalentMany(
        trail,
        L.arrowTypeArgTypes(lhs),
        L.arrowTypeArgTypes(rhs),
      ) &&
      typeEquivalent(trail, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    )
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return typeEquivalent(
      trail,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return typeEquivalent(
      trail,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    return typeEquivalent(
      trail,
      L.recordTypeValueType(lhs),
      L.recordTypeValueType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    return (
      typeEquivalent(trail, L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs)) &&
      typeEquivalent(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    )
  }

  if (L.isDatatypeType(lhs) && L.isDatatypeType(rhs)) {
    trail = [...trail, [lhs, rhs], [rhs, lhs]]
    return typeEquivalent(
      trail,
      unfoldDatatypeType(lhs),
      unfoldDatatypeType(rhs),
    )
  }

  if (L.isDatatypeType(lhs)) {
    trail = [...trail, [lhs, rhs], [rhs, lhs]]

    return typeEquivalent(trail, unfoldDatatypeType(lhs), rhs)
  }

  if (L.isDatatypeType(rhs)) {
    trail = [...trail, [lhs, rhs], [rhs, lhs]]

    return typeEquivalent(trail, lhs, unfoldDatatypeType(rhs))
  }

  if (L.isDisjointUnionType(lhs) && L.isDisjointUnionType(rhs)) {
    return typeEquivalentRecord(
      trail,
      L.disjointUnionTypeVariantTypes(lhs),
      L.disjointUnionTypeVariantTypes(rhs),
    )
  }

  return false
}

function typeEquivalentMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => typeEquivalent(trail, l, r))
  )
}

function typeEquivalentRecord(
  trail: Trail,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): boolean {
  if (Object.values(lhs).length !== Object.values(rhs).length) {
    return false
  }

  for (const k of Object.keys(lhs)) {
    if (!typeEquivalent(trail, lhs[k], rhs[k])) {
      return false
    }
  }

  return true
}
