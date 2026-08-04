import { range } from "@xieyuheng/std.js/range"
import * as M from "../index.ts"
import { occurCheck } from "./occurCheck.ts"

export function unify(
  subst: M.Subst | undefined,
  lhs: M.Type,
  rhs: M.Type,
): M.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  lhs = M.substWalk(subst, lhs)
  rhs = M.substWalk(subst, rhs)

  if (M.isPolymorphicType(lhs)) {
    return unify(subst, M.polymorphicTypeFreshBodyType(lhs), rhs)
  }

  if (M.isPolymorphicType(rhs)) {
    return unify(subst, lhs, M.polymorphicTypeFreshBodyType(rhs))
  }

  if (M.isVarType(lhs) && M.isVarType(rhs)) {
    if (M.varTypeId(lhs) === M.varTypeId(rhs)) {
      return subst
    }
  }

  if (M.isVarType(lhs)) {
    if (occurCheck(subst, lhs, rhs)) {
      return undefined
    } else {
      return M.substExtend(subst, lhs, rhs)
    }
  }

  if (M.isVarType(rhs)) {
    if (occurCheck(subst, rhs, lhs)) {
      return undefined
    } else {
      return M.substExtend(subst, rhs, lhs)
    }
  }

  if (M.isCanonicalLabelType(lhs) && M.isCanonicalLabelType(rhs)) {
    return lhs.serialNumber === rhs.serialNumber ? subst : undefined
  }

  if (M.isTypeType(lhs) && M.isTypeType(rhs)) {
    return subst
  }

  if (M.isAtomType(lhs) && M.isAtomType(rhs)) {
    return lhs.name === rhs.name ? subst : undefined
  }

  if (M.isArrowType(lhs) && M.isArrowType(rhs)) {
    const curriedLhs = M.asArrowType(M.arrowTypeCurrying(lhs))
    const curriedRhs = M.asArrowType(M.arrowTypeCurrying(rhs))
    subst = unifyMany(subst, curriedLhs.argTypes, curriedRhs.argTypes)
    subst = unify(subst, curriedLhs.retType, curriedRhs.retType)
    return subst
  }

  if (M.isListType(lhs) && M.isListType(rhs)) {
    return unify(subst, lhs.elementType, rhs.elementType)
  }

  if (M.isSetType(lhs) && M.isSetType(rhs)) {
    return unify(subst, lhs.elementType, rhs.elementType)
  }

  if (M.isHashType(lhs) && M.isHashType(rhs)) {
    subst = unify(subst, lhs.keyType, rhs.keyType)
    subst = unify(subst, lhs.valueType, rhs.valueType)
    return subst
  }

  if (M.isPairType(lhs) && M.isPairType(rhs)) {
    subst = unify(subst, lhs.firstType, rhs.firstType)
    subst = unify(subst, lhs.secondType, rhs.secondType)
    return subst
  }

  if (M.isDataType(lhs) && M.isDataType(rhs)) {
    if (!M.typeConstructorEqual(lhs.typeConstructor, rhs.typeConstructor)) {
      return undefined
    }

    return unifyMany(subst, lhs.argTypes, rhs.argTypes)
  }

  return undefined
}

export function unifyMany(
  subst: M.Subst | undefined,
  lhs: Array<M.Type>,
  rhs: Array<M.Type>,
): M.Subst | undefined {
  if (subst === undefined) {
    return undefined
  }

  if (lhs.length !== rhs.length) {
    return undefined
  }

  for (const i of range(lhs.length)) {
    subst = unify(subst, lhs[i], rhs[i])
  }

  return subst
}
