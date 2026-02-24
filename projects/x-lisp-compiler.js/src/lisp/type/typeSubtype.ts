import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"
import { trailLoopOccurred, type Trail } from "./Trail.ts"
import { typeEquivalent } from "./typeEquivalent.ts"
import { unfoldDatatypeType } from "./unfoldDatatypeType.ts"

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

  if (L.isDatatypeType(lhs) && L.isDatatypeType(rhs)) {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, unfoldDatatypeType(lhs), unfoldDatatypeType(rhs))
  }

  if (L.isDatatypeType(lhs)) {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, unfoldDatatypeType(lhs), rhs)
  }

  if (L.isDatatypeType(rhs)) {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, lhs, unfoldDatatypeType(rhs))
  }

  if (L.isDisjointUnionType(lhs) && L.isDisjointUnionType(rhs)) {
    const lhsRecord = L.disjointUnionTypeVariantTypes(lhs)
    const rhsRecord = L.disjointUnionTypeVariantTypes(rhs)
    // lhs has less keys
    for (const k of Object.keys(lhsRecord)) {
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) {
        return false
      }
    }

    return true
  }

  if (L.isDisjointUnionType(rhs)) {
    const variantTypes = L.disjointUnionTypeVariantTypes(rhs)
    for (const variantType of Object.values(variantTypes)) {
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
