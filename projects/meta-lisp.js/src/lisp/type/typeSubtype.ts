import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"
import { type Trail } from "./Trail.ts"
import { typeBisimilar } from "./typeBisimilar.ts"

export function typeSubtype(trail: Trail, lhs: L.Value, rhs: L.Value): boolean {
  if (
    L.trailSome(
      trail,
      (entry) => L.valueEqual(entry.lhs, lhs) && L.valueEqual(entry.rhs, rhs),
    )
  ) {
    return true
  }

  if (typeBisimilar([], lhs, rhs)) {
    return true
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    return typeSubtypeMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
  }

  if (L.isInterfaceType(lhs) && L.isInterfaceType(rhs)) {
    const lhsRecord = L.interfaceTypeAttributeTypes(lhs)
    const rhsRecord = L.interfaceTypeAttributeTypes(rhs)
    // rhs should have less keys
    for (const k of Object.keys(rhsRecord)) {
      if (lhsRecord[k] === undefined) return false
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) return false
    }

    return true
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    // contravariant on ArgTypes
    lhs = L.arrowTypeCurrying(lhs)
    rhs = L.arrowTypeCurrying(rhs)
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

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    // key type is invariant
    return (
      typeBisimilar([], L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs)) &&
      typeSubtype(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    )
  }

  if (L.isDatatypeType(lhs) && L.isDatatypeType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(
      trail,
      L.datatypeTypeUnfold(lhs),
      L.datatypeTypeUnfold(rhs),
    )
  }

  if (L.isDatatypeType(lhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, L.datatypeTypeUnfold(lhs), rhs)
  }

  if (L.isDatatypeType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, lhs, L.datatypeTypeUnfold(rhs))
  }

  if (L.isSumType(lhs) && L.isSumType(rhs)) {
    const lhsRecord = L.sumTypeVariantTypes(lhs)
    const rhsRecord = L.sumTypeVariantTypes(rhs)
    // lhs should have less keys
    for (const k of Object.keys(lhsRecord)) {
      if (rhsRecord[k] === undefined) return false
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) return false
    }

    return true
  }

  if (L.isSumType(rhs)) {
    const variantTypes = L.sumTypeVariantTypes(rhs)
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
