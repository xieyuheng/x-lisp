import { range } from "@xieyuheng/helpers.js/range"
import * as M from "../index.ts"
import { typeVarOccurredInType } from "./typeVarOccurredInType.ts"

export function typeUnify(
  subst: M.Subst | undefined,
  lhs: M.Value,
  rhs: M.Value,
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

  if (
    M.isVarType(lhs) &&
    M.isVarType(rhs) &&
    M.varTypeId(lhs) === M.varTypeId(rhs)
  ) {
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

  if (M.isCanonicalLabelType(lhs) && M.isCanonicalLabelType(rhs)) {
    return M.valueEqual(lhs, rhs) ? subst : undefined
  }

  if (M.isTypeType(lhs) && M.isTypeType(rhs)) {
    return M.valueEqual(lhs, rhs) ? subst : undefined
  }

  if (M.isLiteralType(lhs) && M.isLiteralType(rhs)) {
    return M.valueEqual(lhs, rhs) ? subst : undefined
  }

  if (M.isAtomType(lhs) && M.isAtomType(rhs)) {
    return M.atomTypeName(lhs) === M.atomTypeName(rhs) ? subst : undefined
  }

  if (M.isArrowType(lhs) && M.isArrowType(rhs)) {
    lhs = M.arrowTypeCurrying(lhs)
    rhs = M.arrowTypeCurrying(rhs)
    subst = typeUnifyMany(
      subst,
      M.arrowTypeArgTypes(lhs),
      M.arrowTypeArgTypes(rhs),
    )
    subst = typeUnify(subst, M.arrowTypeRetType(lhs), M.arrowTypeRetType(rhs))
    return subst
  }

  if (M.isListType(lhs) && M.isListType(rhs)) {
    return typeUnify(
      subst,
      M.listTypeElementType(lhs),
      M.listTypeElementType(rhs),
    )
  }

  if (M.isSetType(lhs) && M.isSetType(rhs)) {
    return typeUnify(
      subst,
      M.setTypeElementType(lhs),
      M.setTypeElementType(rhs),
    )
  }

  if (M.isHashType(lhs) && M.isHashType(rhs)) {
    subst = typeUnify(subst, M.hashTypeKeyType(lhs), M.hashTypeKeyType(rhs))
    subst = typeUnify(subst, M.hashTypeValueType(lhs), M.hashTypeValueType(rhs))
    return subst
  }

  if (M.isDefinedDataType(lhs) && M.isDefinedDataType(rhs)) {
    if (M.definedDataTypeDefinition(lhs) !== M.definedDataTypeDefinition(rhs)) {
      return undefined
    }

    return typeUnifyMany(
      subst,
      M.definedDataTypeArgTypes(lhs),
      M.definedDataTypeArgTypes(rhs),
    )
  }

  return undefined
}

export function typeUnifyMany(
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
    subst = typeUnify(subst, lhs[i], rhs[i])
  }

  return subst
}
