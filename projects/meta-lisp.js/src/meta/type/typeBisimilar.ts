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

  // - We assume unification and `substApplyToType` are performed on
  //   `lhs` and `rhs`, before calling `typeBisimilar` and `typeSubtype`.
  if (M.isVarType(lhs) && M.isVarType(rhs)) {
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
    return (
      M.definedDataTypeDefinition(lhs) === M.definedDataTypeDefinition(rhs) &&
      typeBisimilarMany(
        trail,
        M.definedDataTypeArgTypes(lhs),
        M.definedDataTypeArgTypes(rhs),
      )
    )
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
