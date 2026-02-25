import { range } from "@xieyuheng/helpers.js/range"
import * as L from "../index.ts"

export function unifyType(
  subst: L.Subst | undefined,
  lhs: L.Value,
  rhs: L.Value,
): L.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  lhs = L.substApplyToType(subst, lhs)
  rhs = L.substApplyToType(subst, rhs)

  if (L.typeEquivalent([], lhs, rhs)) {
    return subst
  }

  if (L.isVarType(lhs)) {
    if (hasOccurrence(L.varTypeSerialNumber(lhs), rhs)) {
      return undefined
    } else {
      return L.extendSubst(subst, L.varTypeSerialNumber(lhs), rhs)
    }
  }

  if (L.isVarType(rhs)) {
    if (hasOccurrence(L.varTypeSerialNumber(rhs), lhs)) {
      return undefined
    } else {
      return L.extendSubst(subst, L.varTypeSerialNumber(rhs), lhs)
    }
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    subst = unifyTypes(
      subst,
      L.arrowTypeArgTypes(lhs),
      L.arrowTypeArgTypes(rhs),
    )
    subst = unifyType(subst, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    return subst
  }

  // isTauType(value)

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return unifyType(
      subst,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return unifyType(
      subst,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    return unifyType(
      subst,
      L.recordTypeValueType(lhs),
      L.recordTypeValueType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    subst = unifyType(subst, L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs))
    subst = unifyType(subst, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    return subst
  }

  // isDatatypeType(value)
  // isDisjointUnionType(value)

  return undefined
}

export function unifyTypes(
  subst: L.Subst | undefined,
  lhsTypes: Array<L.Value>,
  rhsTypes: Array<L.Value>,
): L.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  if (lhsTypes.length !== rhsTypes.length) {
    return undefined
  }

  for (const i of range(lhsTypes.length)) {
    subst = unifyType(subst, lhsTypes[i], rhsTypes[i])
  }

  return subst
}

export function hasOccurrence(serialNumber: bigint, type: L.Value): boolean {
  return false
}
