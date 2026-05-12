import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"
import { typeVarOccurredInType } from "./typeVarOccurredInType.ts"

export function typeUnify(
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
    return typeUnify(subst, M.polymorphicTypeFreshBodyType(lhs), rhs)
  }

  if (M.isPolymorphicType(rhs)) {
    return typeUnify(subst, lhs, M.polymorphicTypeFreshBodyType(rhs))
  }

  if (M.isVarType(lhs) && M.isVarType(rhs)) {
    if (M.varTypeId(lhs) === M.varTypeId(rhs)) {
      return subst
    }
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
    const curriedLhs = M.arrowTypeCurrying(lhs) as M.ArrowType
    const curriedRhs = M.arrowTypeCurrying(rhs) as M.ArrowType
    subst = typeUnifyMany(subst, curriedLhs.argTypes, curriedRhs.argTypes)
    subst = typeUnify(subst, curriedLhs.retType, curriedRhs.retType)
    return subst
  }

  if (M.isListType(lhs) && M.isListType(rhs)) {
    return typeUnify(subst, lhs.elementType, rhs.elementType)
  }

  if (M.isSetType(lhs) && M.isSetType(rhs)) {
    return typeUnify(subst, lhs.elementType, rhs.elementType)
  }

  if (M.isHashType(lhs) && M.isHashType(rhs)) {
    subst = typeUnify(subst, lhs.keyType, rhs.keyType)
    subst = typeUnify(subst, lhs.valueType, rhs.valueType)
    return subst
  }

  if (M.isAlgebraicDataType(lhs) && M.isAlgebraicDataType(rhs)) {
    if (lhs.definition !== rhs.definition) {
      return undefined
    }

    return typeUnifyMany(subst, lhs.argTypes, rhs.argTypes)
  }

  return undefined
}

export function typeUnifyMany(
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
    subst = typeUnify(subst, lhs[i], rhs[i])
  }

  return subst
}
