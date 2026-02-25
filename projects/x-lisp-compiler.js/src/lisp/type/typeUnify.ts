import { range } from "@xieyuheng/helpers.js/range"
import * as L from "../index.ts"

export function typeUnify(
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
    if (occurredInType(L.varTypeSerialNumber(lhs), rhs)) {
      return undefined
    } else {
      return L.extendSubst(subst, L.varTypeSerialNumber(lhs), rhs)
    }
  }

  if (L.isVarType(rhs)) {
    if (occurredInType(L.varTypeSerialNumber(rhs), lhs)) {
      return undefined
    } else {
      return L.extendSubst(subst, L.varTypeSerialNumber(rhs), lhs)
    }
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    subst = typeUnifyMany(
      subst,
      L.arrowTypeArgTypes(lhs),
      L.arrowTypeArgTypes(rhs),
    )
    subst = typeUnify(subst, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    return subst
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    subst = typeUnifyMany(
      subst,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
    subst = typeUnifyRecord(
      subst,
      L.tauTypeAttributeTypes(lhs),
      L.tauTypeAttributeTypes(rhs),
    )
    return subst
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return typeUnify(
      subst,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return typeUnify(
      subst,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isRecordType(lhs) && L.isRecordType(rhs)) {
    return typeUnify(
      subst,
      L.recordTypeValueType(lhs),
      L.recordTypeValueType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    subst = typeUnify(subst, L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs))
    subst = typeUnify(subst, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    return subst
  }

  if (L.isDatatypeType(lhs) && L.isDatatypeType(rhs)) {
    if (
      L.datatypeTypeDatatypeDefinition(lhs) !==
      L.datatypeTypeDatatypeDefinition(rhs)
    ) {
      return undefined
    }

    return typeUnifyMany(
      subst,
      L.datatypeTypeArgTypes(lhs),
      L.datatypeTypeArgTypes(rhs),
    )
  }

  if (L.isDisjointUnionType(lhs) && L.isDisjointUnionType(rhs)) {
    return typeUnifyRecord(
      subst,
      L.disjointUnionTypeVariantTypes(lhs),
      L.disjointUnionTypeVariantTypes(rhs),
    )
  }

  if (L.isDatatypeType(lhs) && L.isDisjointUnionType(rhs)) {
    return typeUnify(subst, L.datatypeTypeUnfold(lhs), rhs)
  }

  if (L.isDisjointUnionType(lhs) && L.isDatatypeType(rhs)) {
    return typeUnify(subst, lhs, L.datatypeTypeUnfold(rhs))
  }

  return undefined
}

export function typeUnifyMany(
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
    subst = typeUnify(subst, lhs[i], rhs[i])
  }

  return subst
}

export function typeUnifyRecord(
  subst: L.Subst | undefined,
  lhs: Record<string, L.Value>,
  rhs: Record<string, L.Value>,
): L.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  for (const key of Object.keys(lhs)) {
    if (rhs[key] !== undefined) {
      subst = typeUnify(subst, lhs[key], rhs[key])
    }
  }

  return subst
}

export function occurredInType(serialNumber: bigint, type: L.Value): boolean {
  if (L.isVarType(type)) {

  }

  if (L.isAnyType(type)) {

  }

  if (L.isLiteralType(type)) {

  }

  if (L.isAtomType(type)) {

  }

  if (L.isArrowType(type)) {

  }

  if (L.isTauType(type)) {

  }

  if (L.isListType(type)) {

  }

  if (L.isSetType(type)) {

  }

  if (L.isRecordType(type)) {

  }

  if (L.isHashType(type)) {

  }

  if (L.isDatatypeType(type)) {

  }

  if (L.isDisjointUnionType(type)) {

  }

  let message = `[occurredInType] unhandled type`
  message += `\n  type: ${L.formatValue(type)}`
  throw new Error(message)
}
