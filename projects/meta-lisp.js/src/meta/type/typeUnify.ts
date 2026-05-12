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

  if (lhs.kind === "PolymorphicType") {
    return typeUnify(subst, M.polymorphicTypeFreshBodyType(lhs), rhs)
  }

  if (rhs.kind === "PolymorphicType") {
    return typeUnify(subst, lhs, M.polymorphicTypeFreshBodyType(rhs))
  }

  if (lhs.kind === "VarType" && rhs.kind === "VarType") {
    if (M.varTypeId(lhs) === M.varTypeId(rhs)) {
      return subst
    }
  }

  if (lhs.kind === "VarType") {
    if (typeVarOccurredInType(lhs, rhs)) {
      return undefined
    } else {
      return M.substExtend(subst, lhs, rhs)
    }
  }

  if (rhs.kind === "VarType") {
    if (typeVarOccurredInType(rhs, lhs)) {
      return undefined
    } else {
      return M.substExtend(subst, rhs, lhs)
    }
  }

  if (lhs.kind === "CanonicalLabelType" && rhs.kind === "CanonicalLabelType") {
    return lhs.serialNumber === rhs.serialNumber ? subst : undefined
  }

  if (lhs.kind === "TypeType" && rhs.kind === "TypeType") {
    return subst
  }

  if (lhs.kind === "AtomType" && rhs.kind === "AtomType") {
    return lhs.name === rhs.name ? subst : undefined
  }

  if (lhs.kind === "ArrowType" && rhs.kind === "ArrowType") {
    const curriedLhs = M.arrowTypeCurrying(lhs) as M.ArrowType
    const curriedRhs = M.arrowTypeCurrying(rhs) as M.ArrowType
    subst = typeUnifyMany(subst, curriedLhs.argTypes, curriedRhs.argTypes)
    subst = typeUnify(subst, curriedLhs.retType, curriedRhs.retType)
    return subst
  }

  if (lhs.kind === "ListType" && rhs.kind === "ListType") {
    return typeUnify(subst, lhs.elementType, rhs.elementType)
  }

  if (lhs.kind === "SetType" && rhs.kind === "SetType") {
    return typeUnify(subst, lhs.elementType, rhs.elementType)
  }

  if (lhs.kind === "HashType" && rhs.kind === "HashType") {
    subst = typeUnify(subst, lhs.keyType, rhs.keyType)
    subst = typeUnify(subst, lhs.valueType, rhs.valueType)
    return subst
  }

  if (lhs.kind === "DefinedDataType" && rhs.kind === "DefinedDataType") {
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
