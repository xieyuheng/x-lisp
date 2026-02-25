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
    // TODO occur check
    return L.extendSubst(subst, L.varTypeSerialNumber(lhs), rhs)
  }

  if (L.isVarType(rhs)) {
    // TODO occur check
    return L.extendSubst(subst, L.varTypeSerialNumber(rhs), lhs)
  }

  // isArrowType(value)
  // isTauType(value)

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return unifyType(subst, L.listTypeElementType(lhs), L.listTypeElementType(rhs))
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return unifyType(subst, L.setTypeElementType(lhs), L.setTypeElementType(rhs))
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    return unifyType(subst, L.recordTypeValueType(lhs), L.recordTypeValueType(rhs))
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
