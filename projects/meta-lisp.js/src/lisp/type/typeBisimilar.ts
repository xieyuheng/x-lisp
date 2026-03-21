import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"
import { type Trail } from "./Trail.ts"

export function typeBisimilar(
  trail: Trail,
  lhs: L.Value,
  rhs: L.Value,
): boolean {
  if (
    L.trailSome(
      trail,
      (entry) =>
        (L.valueEqual(entry.lhs, lhs) && L.valueEqual(entry.rhs, rhs)) ||
        (L.valueEqual(entry.lhs, rhs) && L.valueEqual(entry.rhs, lhs)),
    )
  ) {
    return true
  }

  if (L.isVarType(lhs) && L.isVarType(rhs)) {
    // We assume unification and `substApplyToType` are performed on
    // `lhs` and `rhs`, before calling `typeBisimilar` and
    // `typeSubtype`.
    if (L.varTypeId(lhs) === L.varTypeId(rhs)) {
      return true
    } else {
      return false
    }
  }

  if (L.isCanonicalLabelType(lhs) && L.isCanonicalLabelType(rhs)) {
    return L.valueEqual(lhs, rhs)
  }

  if (L.isTypeType(lhs) && L.isTypeType(rhs)) {
    return L.valueEqual(lhs, rhs)
  }

  if (L.isLiteralType(lhs) && L.isLiteralType(rhs)) {
    return L.valueEqual(lhs, rhs)
  }

  if (L.isAtomType(lhs) && L.isAtomType(rhs)) {
    return L.atomTypeName(lhs) === L.atomTypeName(rhs)
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    return typeBisimilarMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
  }

  if (L.isInterfaceType(lhs) && L.isInterfaceType(rhs)) {
    return typeBisimilarRecord(
      trail,
      L.interfaceTypeAttributeTypes(lhs),
      L.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    lhs = L.arrowTypeCurrying(lhs)
    rhs = L.arrowTypeCurrying(rhs)
    return (
      typeBisimilarMany(
        trail,
        L.arrowTypeArgTypes(lhs),
        L.arrowTypeArgTypes(rhs),
      ) &&
      typeBisimilar(trail, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    )
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return typeBisimilar(
      trail,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return typeBisimilar(
      trail,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    return (
      typeBisimilar(trail, L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs)) &&
      typeBisimilar(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    )
  }

  if (L.isDefinedDataType(lhs) && L.isDefinedDataType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeBisimilar(
      trail,
      L.definedDataTypeUnfold(lhs),
      L.definedDataTypeUnfold(rhs),
    )
  }

  if (L.isDefinedDataType(lhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, L.definedDataTypeUnfold(lhs), rhs)
  }

  if (L.isDefinedDataType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, lhs, L.definedDataTypeUnfold(rhs))
  }

  if (L.isSumType(lhs) && L.isSumType(rhs)) {
    return typeBisimilarRecord(
      trail,
      L.sumTypeVariantTypes(lhs),
      L.sumTypeVariantTypes(rhs),
    )
  }

  if (L.isDefinedInterfaceType(lhs) && L.isDefinedInterfaceType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeBisimilar(
      trail,
      L.definedInterfaceTypeUnfold(lhs),
      L.definedInterfaceTypeUnfold(rhs),
    )
  }

  if (L.isDefinedInterfaceType(lhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, L.definedInterfaceTypeUnfold(lhs), rhs)
  }

  if (L.isDefinedInterfaceType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeBisimilar(trail, lhs, L.definedInterfaceTypeUnfold(rhs))
  }

  return false
}

function typeBisimilarMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => typeBisimilar(trail, l, r))
  )
}

function typeBisimilarRecord(
  trail: Trail,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): boolean {
  if (Object.keys(lhs).length !== Object.keys(rhs).length) return false

  for (const k of Object.keys(lhs)) {
    if (rhs[k] === undefined) return false
    if (!typeBisimilar(trail, lhs[k], rhs[k])) return false
  }

  return true
}
