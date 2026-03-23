import { mapMapValue } from "@xieyuheng/helpers.js/map"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as M from "../index.ts"

export function substApplyToType(subst: M.Subst, type: M.Value): M.Value {
  return substApplyToTypeWithBoundIds(new Set(), subst, type)
}

export function substApplyToCtx(subst: M.Subst, ctx: M.Ctx): M.Ctx {
  return mapMapValue(ctx, (t) => M.substApplyToType(subst, t))
}

function substApplyToTypeWithBoundIds(
  boundIds: Set<string>,
  subst: M.Subst,
  type: M.Value,
): M.Value {
  if (M.isVarType(type)) {
    const id = M.varTypeId(type)
    if (boundIds.has(id)) {
      return type
    }

    const found = M.substLookup(subst, id)
    if (found !== undefined) {
      return found
    }

    return type
  }

  if (M.isCanonicalLabelType(type)) {
    return type
  }

  if (M.isTypeType(type)) {
    return type
  }

  if (M.isLiteralType(type)) {
    return type
  }

  if (M.isAtomType(type)) {
    return type
  }

  if (M.isTauType(type)) {
    return M.createTauType(
      M.tauTypeElementTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isInterfaceType(type)) {
    return M.createInterfaceType(
      recordMapValue(M.interfaceTypeAttributeTypes(type), (t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isExtendInterfaceType(type)) {
    return M.createExtendInterfaceType(
      substApplyToTypeWithBoundIds(
        boundIds,
        subst,
        M.extendInterfaceTypeBaseType(type),
      ),
      recordMapValue(M.extendInterfaceTypeAttributeTypes(type), (t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isArrowType(type)) {
    return M.createArrowType(
      M.arrowTypeArgTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
      substApplyToTypeWithBoundIds(boundIds, subst, M.arrowTypeRetType(type)),
    )
  }

  if (M.isListType(type)) {
    return M.createListType(
      substApplyToTypeWithBoundIds(
        boundIds,
        subst,
        M.listTypeElementType(type),
      ),
    )
  }

  if (M.isSetType(type)) {
    return M.createSetType(
      substApplyToTypeWithBoundIds(boundIds, subst, M.setTypeElementType(type)),
    )
  }

  if (M.isHashType(type)) {
    return M.createHashType(
      substApplyToTypeWithBoundIds(boundIds, subst, M.hashTypeKeyType(type)),
      substApplyToTypeWithBoundIds(boundIds, subst, M.hashTypeValueType(type)),
    )
  }

  if (M.isDefinedDataType(type)) {
    return M.createDefinedDataType(
      M.definedDataTypeDefinition(type),
      M.definedDataTypeArgTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isDefinedInterfaceType(type)) {
    return M.createDefinedInterfaceType(
      M.definedInterfaceTypeDefinition(type),
      M.definedInterfaceTypeArgTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isSumType(type)) {
    return M.createSumType(
      recordMapValue(M.sumTypeVariantTypes(type), (t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (M.isPolymorphicType(type)) {
    // - Be careful about the "name-capture" problem.
    type = M.polymorphicTypeFreshSelf(type)

    const varTypes = M.polymorphicTypeVarTypes(type)
    const bodyType = M.polymorphicTypeBodyType(type)

    return M.createPolymorphicType(
      varTypes,
      substApplyToTypeWithBoundIds(
        new Set([...boundIds, ...varTypes.map(M.varTypeId)]),
        subst,
        bodyType,
      ),
    )
  }

  let message = `[substApplyToTypeWithBoundIds] unhandled type`
  message += `\n  type: ${M.formatType(type)}`
  throw new Error(message)
}
