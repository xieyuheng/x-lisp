import { range } from "@xieyuheng/helpers.js/range"
import { setDifference, setEqual } from "@xieyuheng/helpers.js/set"
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

  if (M.typeSubtype([], lhs, rhs) || M.typeSubtype([], rhs, lhs)) {
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

  if (M.isTauType(lhs) && M.isTauType(rhs)) {
    return typeUnifyMany(
      trail,
      subst,
      M.tauTypeElementTypes(lhs),
      M.tauTypeElementTypes(rhs),
    )
  }

  if (M.isInterfaceType(lhs) && M.isInterfaceType(rhs)) {
    return typeUnifyRecord(
      trail,
      subst,
      M.interfaceTypeAttributeTypes(lhs),
      M.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isInterfaceType(lhs) && M.isExtendInterfaceType(rhs)) {
    rhs = M.extendInterfaceTypeMerge(rhs)

    const rhsBaseType = M.extendInterfaceTypeBaseType(rhs)

    const lhsAttributeTypes = M.interfaceTypeAttributeTypes(lhs)
    const rhsAttributeTypes = M.extendInterfaceTypeAttributeTypes(rhs)

    const lhsKeys = new Set(Object.keys(lhsAttributeTypes))
    const rhsKeys = new Set(Object.keys(rhsAttributeTypes))

    const rhsPopulatedBaseType = M.populateExtendInterfaceType(
      Array.from(setDifference(lhsKeys, rhsKeys)),
    )

    subst = typeUnify(trail, subst, rhsBaseType, rhsPopulatedBaseType)

    if (subst === undefined) return undefined

    rhs = M.substApplyToType(subst, rhs)

    rhs = M.extendInterfaceTypeMerge(rhs)

    return typeUnifyRecord(
      trail,
      subst,
      M.interfaceTypeAttributeTypes(lhs),
      M.extendInterfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isExtendInterfaceType(lhs) && M.isInterfaceType(rhs)) {
    lhs = M.extendInterfaceTypeMerge(lhs)

    const lhsBaseType = M.extendInterfaceTypeBaseType(lhs)

    const lhsAttributeTypes = M.extendInterfaceTypeAttributeTypes(lhs)
    const rhsAttributeTypes = M.interfaceTypeAttributeTypes(rhs)

    const lhsKeys = new Set(Object.keys(lhsAttributeTypes))
    const rhsKeys = new Set(Object.keys(rhsAttributeTypes))

    const lhsPopulatedBaseType = M.populateExtendInterfaceType(
      Array.from(setDifference(rhsKeys, lhsKeys)),
    )

    subst = typeUnify(trail, subst, lhsBaseType, lhsPopulatedBaseType)

    if (subst === undefined) return undefined

    lhs = M.substApplyToType(subst, lhs)

    lhs = M.extendInterfaceTypeMerge(lhs)

    return typeUnifyRecord(
      trail,
      subst,
      M.extendInterfaceTypeAttributeTypes(lhs),
      M.interfaceTypeAttributeTypes(rhs),
    )
  }

  if (M.isExtendInterfaceType(lhs) && M.isExtendInterfaceType(rhs)) {
    lhs = M.extendInterfaceTypeMerge(lhs)
    rhs = M.extendInterfaceTypeMerge(rhs)

    const lhsBaseType = M.extendInterfaceTypeBaseType(lhs)
    const rhsBaseType = M.extendInterfaceTypeBaseType(rhs)

    const lhsAttributeTypes = M.extendInterfaceTypeAttributeTypes(lhs)
    const rhsAttributeTypes = M.extendInterfaceTypeAttributeTypes(rhs)

    const lhsKeys = new Set(Object.keys(lhsAttributeTypes))
    const rhsKeys = new Set(Object.keys(rhsAttributeTypes))

    if (
      M.isVarType(lhsBaseType) &&
      M.isVarType(rhsBaseType) &&
      M.varTypeEqual(lhsBaseType, rhsBaseType)
    ) {
      if (setEqual(lhsKeys, rhsKeys)) {
        return typeUnifyRecord(
          trail,
          subst,
          M.extendInterfaceTypeAttributeTypes(lhs),
          M.extendInterfaceTypeAttributeTypes(rhs),
        )
      } else {
        return undefined
      }
    }

    const lhsPopulatedBaseType = M.populateExtendInterfaceType(
      Array.from(setDifference(rhsKeys, lhsKeys)),
    )
    const rhsPopulatedBaseType = M.populateExtendInterfaceType(
      Array.from(setDifference(lhsKeys, rhsKeys)),
    )

    subst = typeUnify(trail, subst, lhsBaseType, lhsPopulatedBaseType)
    subst = typeUnify(trail, subst, rhsBaseType, rhsPopulatedBaseType)

    if (subst === undefined) return undefined

    lhs = M.substApplyToType(subst, lhs)
    rhs = M.substApplyToType(subst, rhs)

    lhs = M.extendInterfaceTypeMerge(lhs)
    rhs = M.extendInterfaceTypeMerge(rhs)

    subst = typeUnifyRecord(
      trail,
      subst,
      M.extendInterfaceTypeAttributeTypes(lhs),
      M.extendInterfaceTypeAttributeTypes(rhs),
    )
    subst = typeUnify(
      trail,
      subst,
      M.extendInterfaceTypeBaseType(lhs),
      M.extendInterfaceTypeBaseType(rhs),
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
    return typeUnify(
      trail,
      subst,
      M.definedDataTypeUnfold(lhs),
      M.definedDataTypeUnfold(rhs),
    )
  }

  if (M.isDefinedDataType(lhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeUnify(trail, subst, M.definedDataTypeUnfold(lhs), rhs)
  }

  if (M.isDefinedDataType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeUnify(trail, subst, lhs, M.definedDataTypeUnfold(rhs))
  }

  if (M.isSumType(lhs) && M.isSumType(rhs)) {
    return typeUnifyRecord(
      trail,
      subst,
      M.sumTypeVariantTypes(lhs),
      M.sumTypeVariantTypes(rhs),
    )
  }

  if (M.isDefinedInterfaceType(lhs) && M.isDefinedInterfaceType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeUnify(
      trail,
      subst,
      M.definedInterfaceTypeUnfold(lhs),
      M.definedInterfaceTypeUnfold(rhs),
    )
  }

  if (M.isDefinedInterfaceType(lhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeUnify(trail, subst, M.definedInterfaceTypeUnfold(lhs), rhs)
  }

  if (M.isDefinedInterfaceType(rhs)) {
    trail = M.trailAdd(trail, lhs, rhs)
    return typeUnify(trail, subst, lhs, M.definedInterfaceTypeUnfold(rhs))
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

export function typeUnifyRecord(
  trail: M.Trail,
  subst: M.Subst | undefined,
  lhs: Record<string, M.Value>,
  rhs: Record<string, M.Value>,
): M.Subst | undefined {
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
