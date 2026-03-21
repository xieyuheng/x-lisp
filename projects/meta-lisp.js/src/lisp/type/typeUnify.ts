import { range } from "@xieyuheng/helpers.js/range"
import * as L from "../index.ts"
import { typeVarOccurredInType } from "./typeVarOccurredInType.ts"

export function typeUnify(
  trail: L.Trail,
  subst: L.Subst | undefined,
  lhs: L.Value,
  rhs: L.Value,
): L.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  lhs = L.substApplyToType(subst, lhs)
  rhs = L.substApplyToType(subst, rhs)

  lhs = L.typeFreshen(lhs)
  rhs = L.typeFreshen(rhs)

  if (
    L.trailSome(
      trail,
      (entry) =>
        (L.valueEqual(entry.lhs, lhs) && L.valueEqual(entry.rhs, rhs)) ||
        (L.valueEqual(entry.lhs, rhs) && L.valueEqual(entry.rhs, lhs)),
    )
  ) {
    return subst
  }

  if (L.typeSubtype([], lhs, rhs) || L.typeSubtype([], rhs, lhs)) {
    return subst
  }

  if (L.isVarType(lhs)) {
    if (typeVarOccurredInType(lhs, rhs)) {
      return undefined
    } else {
      return L.substExtend(subst, lhs, rhs)
    }
  }

  if (L.isVarType(rhs)) {
    if (typeVarOccurredInType(rhs, lhs)) {
      return undefined
    } else {
      return L.substExtend(subst, rhs, lhs)
    }
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    lhs = L.arrowTypeCurrying(lhs)
    rhs = L.arrowTypeCurrying(rhs)
    subst = typeUnifyMany(
      trail,
      subst,
      L.arrowTypeArgTypes(lhs),
      L.arrowTypeArgTypes(rhs),
    )
    subst = typeUnify(
      trail,
      subst,
      L.arrowTypeRetType(lhs),
      L.arrowTypeRetType(rhs),
    )
    return subst
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    return typeUnifyMany(
      trail,
      subst,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
  }

  if (L.isInterfaceType(lhs) && L.isInterfaceType(rhs)) {
    return typeUnifyRecord(
      trail,
      subst,
      L.interfaceTypeAttributeTypes(lhs),
      L.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return typeUnify(
      trail,
      subst,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return typeUnify(
      trail,
      subst,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    subst = typeUnify(
      trail,
      subst,
      L.hashTypeKeyType(lhs),
      L.hashTypeKeyType(rhs),
    )
    subst = typeUnify(
      trail,
      subst,
      L.hashTypeValueType(lhs),
      L.hashTypeValueType(rhs),
    )
    return subst
  }

  if (L.isDefinedDataType(lhs) && L.isDefinedDataType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeUnify(
      trail,
      subst,
      L.definedDataTypeUnfold(lhs),
      L.definedDataTypeUnfold(rhs),
    )
  }

  if (L.isDefinedDataType(lhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeUnify(trail, subst, L.definedDataTypeUnfold(lhs), rhs)
  }

  if (L.isDefinedDataType(rhs)) {
    trail = L.trailAdd(trail, lhs, rhs)
    return typeUnify(trail, subst, lhs, L.definedDataTypeUnfold(rhs))
  }

  if (L.isSumType(lhs) && L.isSumType(rhs)) {
    return typeUnifyRecord(
      trail,
      subst,
      L.sumTypeVariantTypes(lhs),
      L.sumTypeVariantTypes(rhs),
    )
  }

  return undefined
}

export function typeUnifyMany(
  trail: L.Trail,
  subst: L.Subst | undefined,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): L.Subst | undefined {
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

export function typeUnifyRecord(
  trail: L.Trail,
  subst: L.Subst | undefined,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): L.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  for (const key of Object.keys(lhs)) {
    if (rhs[key] !== undefined) {
      subst = typeUnify(trail, subst, lhs[key], rhs[key])
    }
  }

  return subst
}
