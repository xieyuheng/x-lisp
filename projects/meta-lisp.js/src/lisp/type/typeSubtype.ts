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
    return typeSubtypeAttributes(
      trail,
      L.interfaceTypeAttributeTypes(lhs),
      L.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (L.isInterfaceType(lhs) && L.isExtendInterfaceType(rhs)) {
    rhs = L.extendInterfaceTypeMerge(rhs)

    return typeSubtypeAttributes(
      trail,
      L.interfaceTypeAttributeTypes(lhs),
      L.extendInterfaceTypeAttributeTypes(rhs),
    )
  }

  if (L.isExtendInterfaceType(lhs) && L.isInterfaceType(rhs)) {
    lhs = L.extendInterfaceTypeMerge(lhs)

    return typeSubtypeAttributes(
      trail,
      L.extendInterfaceTypeAttributeTypes(lhs),
      L.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (L.isExtendInterfaceType(lhs) && L.isExtendInterfaceType(rhs)) {
    lhs = L.extendInterfaceTypeMerge(lhs)
    rhs = L.extendInterfaceTypeMerge(rhs)

    return (
      typeSubtype(
        trail,
        L.extendInterfaceTypeBaseType(lhs),
        L.extendInterfaceTypeBaseType(rhs),
      ) &&
      typeSubtypeAttributes(
        trail,
        L.extendInterfaceTypeAttributeTypes(lhs),
        L.extendInterfaceTypeAttributeTypes(rhs),
      )
    )
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

  if (L.isDefinedDataType(lhs) && L.isDefinedDataType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(
      trail,
      L.definedDataTypeUnfold(lhs),
      L.definedDataTypeUnfold(rhs),
    )
  }

  if (L.isDefinedDataType(lhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, L.definedDataTypeUnfold(lhs), rhs)
  }

  if (L.isDefinedDataType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, lhs, L.definedDataTypeUnfold(rhs))
  }

  if (L.isSumType(lhs) && L.isSumType(rhs)) {
    return typeSubtypeVariants(
      trail,
      L.sumTypeVariantTypes(lhs),
      L.sumTypeVariantTypes(rhs),
    )
  }

  if (L.isSumType(rhs)) {
    const variantTypes = L.sumTypeVariantTypes(rhs)
    for (const variantType of Object.values(variantTypes)) {
      if (typeSubtype(trail, lhs, variantType)) {
        return true
      }
    }
  }

  if (L.isDefinedInterfaceType(lhs) && L.isDefinedInterfaceType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(
      trail,
      L.definedInterfaceTypeUnfold(lhs),
      L.definedInterfaceTypeUnfold(rhs),
    )
  }

  if (L.isDefinedInterfaceType(lhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, L.definedInterfaceTypeUnfold(lhs), rhs)
  }

  if (L.isDefinedInterfaceType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, lhs, L.definedInterfaceTypeUnfold(rhs))
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

function typeSubtypeAttributes(
  trail: Trail,
  lhsRecord: Record<string, L.Value>,
  rhsRecord: Record<string, L.Value>,
): boolean {
  // rhs should have less keys
  for (const k of Object.keys(rhsRecord)) {
    if (lhsRecord[k] === undefined) return false
    if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) return false
  }

  return true
}

function typeSubtypeVariants(
  trail: Trail,
  lhsRecord: Record<string, L.Value>,
  rhsRecord: Record<string, L.Value>,
): boolean {
  // lhs should have less keys
  for (const k of Object.keys(lhsRecord)) {
    if (rhsRecord[k] === undefined) return false
    if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) return false
  }

  return true
}
