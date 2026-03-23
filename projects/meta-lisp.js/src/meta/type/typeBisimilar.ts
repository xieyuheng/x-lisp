import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"
import { type Trail } from "./Trail.ts"

export function typeBisimilar(
  trail: Trail,
  lhs: M.Value,
  rhs: M.Value,
): boolean {
  if (
    M.trailSome(
      trail,
      (entry) =>
        (M.valueEqual(entry.lhs, lhs) && M.valueEqual(entry.rhs, rhs)) ||
        (M.valueEqual(entry.lhs, rhs) && M.valueEqual(entry.rhs, lhs)),
    )
  ) {
    return true
  }

  if (M.isVarType(lhs) && M.isVarType(rhs)) {
    // We assume unification and `substApplyToType` are performed on
    // `lhs` and `rhs`, before calling `typeBisimilar` and
    // `typeSubtype`.
    if (M.varTypeId(lhs) === M.varTypeId(rhs)) {
      return true
    } else {
      return false
    }
  }

  if (M.isCanonicalLabelType(lhs) && M.isCanonicalLabelType(rhs)) {
    return M.valueEqual(lhs, rhs)
  }

  if (M.isTypeType(lhs) && M.isTypeType(rhs)) {
    return M.valueEqual(lhs, rhs)
  }

  if (M.isLiteralType(lhs) && M.isLiteralType(rhs)) {
    return M.valueEqual(lhs, rhs)
  }

  if (M.isAtomType(lhs) && M.isAtomType(rhs)) {
    return M.atomTypeName(lhs) === M.atomTypeName(rhs)
  }

  if (M.isTauType(lhs) && M.isTauType(rhs)) {
    return typeBisimilarMany(
      trail,
      M.tauTypeElementTypes(lhs),
      M.tauTypeElementTypes(rhs),
    )
  }

  if (M.isInterfaceType(lhs) && M.isInterfaceType(rhs)) {
    return typeBisimilarRecord(
      trail,
      M.interfaceTypeAttributeTypes(lhs),
      M.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isExtendInterfaceType(lhs) && M.isExtendInterfaceType(rhs)) {
    return (
      typeBisimilar(
        trail,
        M.extendInterfaceTypeBaseType(lhs),
        M.extendInterfaceTypeBaseType(rhs),
      ) &&
      typeBisimilarRecord(
        trail,
        M.extendInterfaceTypeAttributeTypes(lhs),
        M.extendInterfaceTypeAttributeTypes(rhs),
      )
    )
  }

  if (M.isArrowType(lhs) && M.isArrowType(rhs)) {
    lhs = M.arrowTypeCurrying(lhs)
    rhs = M.arrowTypeCurrying(rhs)
    return (
      typeBisimilarMany(
        trail,
        M.arrowTypeArgTypes(lhs),
        M.arrowTypeArgTypes(rhs),
      ) &&
      typeBisimilar(trail, M.arrowTypeRetType(lhs), M.arrowTypeRetType(rhs))
    )
  }

  if (M.isListType(lhs) && M.isListType(rhs)) {
    return typeBisimilar(
      trail,
      M.listTypeElementType(lhs),
      M.listTypeElementType(rhs),
    )
  }

  if (M.isSetType(lhs) && M.isSetType(rhs)) {
    return typeBisimilar(
      trail,
      M.setTypeElementType(lhs),
      M.setTypeElementType(rhs),
    )
  }

  if (M.isHashType(lhs) && M.isHashType(rhs)) {
    return (
      typeBisimilar(trail, M.hashTypeKeyType(lhs), M.hashTypeKeyType(rhs)) &&
      typeBisimilar(trail, M.hashTypeValueType(lhs), M.hashTypeValueType(rhs))
    )
  }

  if (M.isDefinedDataType(lhs) && M.isDefinedDataType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeBisimilar(
      trail,
      M.definedDataTypeUnfold(lhs),
      M.definedDataTypeUnfold(rhs),
    )
  }

  if (M.isDefinedDataType(lhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, M.definedDataTypeUnfold(lhs), rhs)
  }

  if (M.isDefinedDataType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, lhs, M.definedDataTypeUnfold(rhs))
  }

  if (M.isSumType(lhs) && M.isSumType(rhs)) {
    return typeBisimilarRecord(
      trail,
      M.sumTypeVariantTypes(lhs),
      M.sumTypeVariantTypes(rhs),
    )
  }

  if (M.isDefinedInterfaceType(lhs) && M.isDefinedInterfaceType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeBisimilar(
      trail,
      M.definedInterfaceTypeUnfold(lhs),
      M.definedInterfaceTypeUnfold(rhs),
    )
  }

  if (M.isDefinedInterfaceType(lhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, M.definedInterfaceTypeUnfold(lhs), rhs)
  }

  if (M.isDefinedInterfaceType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, lhs, M.definedInterfaceTypeUnfold(rhs))
  }

  return false
}

function typeBisimilarMany(
  trail: Trail,
  lhs: Array<M.Value>,
  rhs: Array<M.Value>,
): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => typeBisimilar(trail, l, r))
  )
}

function typeBisimilarRecord(
  trail: Trail,
  lhs: Record<string, M.Value>,
  rhs: Record<string, M.Value>,
): boolean {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) return false

  for (const k of Object.keys(lhs)) {
    if (rhs[k] === undefined) return false
    if (!typeBisimilar(trail, lhs[k], rhs[k])) return false
  }

  return true
}
