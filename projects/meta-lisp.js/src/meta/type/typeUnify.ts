import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"
import { typeVarOccurredInType } from "./typeVarOccurredInType.ts"

export function typeUnify(
  trail: M.Trail,
  subst: M.Subst | undefined,
  lhs: M.Value,
  rhs: M.Value,
): M.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  lhs = M.substApplyToType(subst, lhs)
  rhs = M.substApplyToType(subst, rhs)

  lhs = M.typeFreshen(lhs)
  rhs = M.typeFreshen(rhs)

  if (
    M.trailSome(
      trail,
      (entry) =>
        (M.valueEqual(entry.lhs, lhs) && M.valueEqual(entry.rhs, rhs)) ||
        (M.valueEqual(entry.lhs, rhs) && M.valueEqual(entry.rhs, lhs)),
    )
  ) {
    return subst
  }

  // - we check subtype relation first,
  //   which means we view subtype relation as
  //   base case of recursive unification.
  // - unification is mainly about var type,
  //   while bisimilar relation does not handle var type,
  //   i.e. return true only when two var types are the same.
  if (M.typeBisimilar([], lhs, rhs)) {
    return subst
  }

  if (M.isVarType(lhs)) {
    if (typeVarOccurredInType(lhs, rhs)) {
      return undefined
    } else {
      return M.substExtend(subst, lhs, rhs)
    }
  }

  if (M.isVarType(rhs)) {
    if (typeVarOccurredInType(rhs, lhs)) {
      return undefined
    } else {
      return M.substExtend(subst, rhs, lhs)
    }
  }

  if (M.isArrowType(lhs) && M.isArrowType(rhs)) {
    lhs = M.arrowTypeCurrying(lhs)
    rhs = M.arrowTypeCurrying(rhs)
    subst = typeUnifyMany(
      trail,
      subst,
      M.arrowTypeArgTypes(lhs),
      M.arrowTypeArgTypes(rhs),
    )
    subst = typeUnify(
      trail,
      subst,
      M.arrowTypeRetType(lhs),
      M.arrowTypeRetType(rhs),
    )
    return subst
  }

  if (M.isListType(lhs) && M.isListType(rhs)) {
    return typeUnify(
      trail,
      subst,
      M.listTypeElementType(lhs),
      M.listTypeElementType(rhs),
    )
  }

  if (M.isSetType(lhs) && M.isSetType(rhs)) {
    return typeUnify(
      trail,
      subst,
      M.setTypeElementType(lhs),
      M.setTypeElementType(rhs),
    )
  }

  if (M.isHashType(lhs) && M.isHashType(rhs)) {
    subst = typeUnify(
      trail,
      subst,
      M.hashTypeKeyType(lhs),
      M.hashTypeKeyType(rhs),
    )
    subst = typeUnify(
      trail,
      subst,
      M.hashTypeValueType(lhs),
      M.hashTypeValueType(rhs),
    )
    return subst
  }

  if (M.isDefinedDataType(lhs) && M.isDefinedDataType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    if (M.definedDataTypeDefinition(lhs) !== M.definedDataTypeDefinition(rhs)) {
      return undefined
    }

    return typeUnifyMany(
      trail,
      subst,
      M.definedDataTypeArgTypes(lhs),
      M.definedDataTypeArgTypes(rhs),
    )
  }

  return undefined
}

export function typeUnifyMany(
  trail: M.Trail,
  subst: M.Subst | undefined,
  lhs: Array<M.Value>,
  rhs: Array<M.Value>,
): M.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  if (lhs.length !== rhs.length) {
    return undefined
  }

  for (const i of range(lhs.length)) {
    subst = typeUnify(trail, subst, lhs[i], rhs[i])
  }

  return subst
}
