import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"
import { type Trail } from "./Trail.ts"
import { typeBisimilar } from "./typeBisimilar.ts"

export function typeSubtype(trail: Trail, lhs: M.Value, rhs: M.Value): boolean {
  if (
    M.trailSome(
      trail,
      (entry) => M.valueEqual(entry.lhs, lhs) && M.valueEqual(entry.rhs, rhs),
    )
  ) {
    return true
  }

  if (typeBisimilar([], lhs, rhs)) {
    return true
  }

  if (M.isTauType(lhs) && M.isTauType(rhs)) {
    return typeSubtypeMany(
      trail,
      M.tauTypeElementTypes(lhs),
      M.tauTypeElementTypes(rhs),
    )
  }

  if (M.isInterfaceType(lhs) && M.isInterfaceType(rhs)) {
    return typeSubtypeAttributes(
      trail,
      M.interfaceTypeAttributeTypes(lhs),
      M.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isInterfaceType(lhs) && M.isExtendInterfaceType(rhs)) {
    rhs = M.extendInterfaceTypeMerge(rhs)

    return typeSubtypeAttributes(
      trail,
      M.interfaceTypeAttributeTypes(lhs),
      M.extendInterfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isExtendInterfaceType(lhs) && M.isInterfaceType(rhs)) {
    lhs = M.extendInterfaceTypeMerge(lhs)

    return typeSubtypeAttributes(
      trail,
      M.extendInterfaceTypeAttributeTypes(lhs),
      M.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isExtendInterfaceType(lhs) && M.isExtendInterfaceType(rhs)) {
    lhs = M.extendInterfaceTypeMerge(lhs)
    rhs = M.extendInterfaceTypeMerge(rhs)

    return (
      typeSubtype(
        trail,
        M.extendInterfaceTypeBaseType(lhs),
        M.extendInterfaceTypeBaseType(rhs),
      ) &&
      typeSubtypeAttributes(
        trail,
        M.extendInterfaceTypeAttributeTypes(lhs),
        M.extendInterfaceTypeAttributeTypes(rhs),
      )
    )
  }

  if (M.isArrowType(lhs) && M.isArrowType(rhs)) {
    // contravariant on ArgTypes
    lhs = M.arrowTypeCurrying(lhs)
    rhs = M.arrowTypeCurrying(rhs)
    return (
      typeSubtypeMany(
        trail,
        M.arrowTypeArgTypes(rhs),
        M.arrowTypeArgTypes(lhs),
      ) && typeSubtype(trail, M.arrowTypeRetType(lhs), M.arrowTypeRetType(rhs))
    )
  }

  if (M.isListType(lhs) && M.isListType(rhs)) {
    return typeSubtype(
      trail,
      M.listTypeElementType(lhs),
      M.listTypeElementType(rhs),
    )
  }

  if (M.isSetType(lhs) && M.isSetType(rhs)) {
    return typeSubtype(
      trail,
      M.setTypeElementType(lhs),
      M.setTypeElementType(rhs),
    )
  }

  if (M.isHashType(lhs) && M.isHashType(rhs)) {
    // key type is invariant
    return (
      typeSubtype([], M.hashTypeKeyType(lhs), M.hashTypeKeyType(rhs)) &&
      typeSubtype([], M.hashTypeKeyType(rhs), M.hashTypeKeyType(lhs)) &&
      typeSubtype(trail, M.hashTypeValueType(lhs), M.hashTypeValueType(rhs))
    )
  }

  if (M.isDefinedDataType(lhs) && M.isDefinedDataType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeSubtype(
      trail,
      M.definedDataTypeUnfold(lhs),
      M.definedDataTypeUnfold(rhs),
    )
  }

  if (M.isDefinedDataType(lhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, M.definedDataTypeUnfold(lhs), rhs)
  }

  if (M.isDefinedDataType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, lhs, M.definedDataTypeUnfold(rhs))
  }

  if (M.isSumType(lhs) && M.isSumType(rhs)) {
    return typeSubtypeVariants(
      trail,
      M.sumTypeVariantTypes(lhs),
      M.sumTypeVariantTypes(rhs),
    )
  }

  if (M.isSumType(rhs)) {
    const variantTypes = M.sumTypeVariantTypes(rhs)
    for (const variantType of Object.values(variantTypes)) {
      if (typeSubtype(trail, lhs, variantType)) {
        return true
      }
    }
  }

  if (M.isDefinedInterfaceType(lhs) && M.isDefinedInterfaceType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeSubtype(
      trail,
      M.definedInterfaceTypeUnfold(lhs),
      M.definedInterfaceTypeUnfold(rhs),
    )
  }

  if (M.isDefinedInterfaceType(lhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, M.definedInterfaceTypeUnfold(lhs), rhs)
  }

  if (M.isDefinedInterfaceType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeSubtype(trail, lhs, M.definedInterfaceTypeUnfold(rhs))
  }

  return false
}

function typeSubtypeMany(
  trail: Trail,
  lhs: Array<M.Value>,
  rhs: Array<M.Value>,
): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => typeSubtype(trail, l, r))
  )
}

function typeSubtypeAttributes(
  trail: Trail,
  lhsRecord: Record<string, M.Value>,
  rhsRecord: Record<string, M.Value>,
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
  lhsRecord: Record<string, M.Value>,
  rhsRecord: Record<string, M.Value>,
): boolean {
  // lhs should have less keys
  for (const k of Object.keys(lhsRecord)) {
    if (rhsRecord[k] === undefined) return false
    if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) return false
  }

  return true
}
