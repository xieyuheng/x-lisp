import { mapMapValue } from "@xieyuheng/helpers.js/map"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"

export function substApplyToType(subst: L.Subst, type: L.Value): L.Value {
  return substApplyToTypeWithBoundIds(new Set(), subst, type)
}

export function substApplyToCtx(subst: L.Subst, ctx: L.Ctx): L.Ctx {
  return mapMapValue(ctx, (t) => L.substApplyToType(subst, t))
}

function substApplyToTypeWithBoundIds(
  boundIds: Set<string>,
  subst: L.Subst,
  type: L.Value,
): L.Value {
  if (L.isVarType(type)) {
    const id = L.varTypeId(type)
    if (boundIds.has(id)) {
      return type
    }

    const found = L.substLookup(subst, id)
    if (found !== undefined) {
      return found
    }

    return type
  }

  if (L.isCanonicalLabelType(type)) {
    return type
  }

  if (L.isTypeType(type)) {
    return type
  }

  if (L.isLiteralType(type)) {
    return type
  }

  if (L.isAtomType(type)) {
    return type
  }

  if (L.isTauType(type)) {
    return L.createTauType(
      L.tauTypeElementTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (L.isInterfaceType(type)) {
    return L.createInterfaceType(
      recordMapValue(L.interfaceTypeAttributeTypes(type), (t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (L.isArrowType(type)) {
    return L.createArrowType(
      L.arrowTypeArgTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
      substApplyToTypeWithBoundIds(boundIds, subst, L.arrowTypeRetType(type)),
    )
  }

  if (L.isListType(type)) {
    return L.createListType(
      substApplyToTypeWithBoundIds(
        boundIds,
        subst,
        L.listTypeElementType(type),
      ),
    )
  }

  if (L.isSetType(type)) {
    return L.createSetType(
      substApplyToTypeWithBoundIds(boundIds, subst, L.setTypeElementType(type)),
    )
  }

  if (L.isHashType(type)) {
    return L.createHashType(
      substApplyToTypeWithBoundIds(boundIds, subst, L.hashTypeKeyType(type)),
      substApplyToTypeWithBoundIds(boundIds, subst, L.hashTypeValueType(type)),
    )
  }

  if (L.isDatatypeType(type)) {
    return L.createDatatypeType(
      L.datatypeTypeDatatypeDefinition(type),
      L.datatypeTypeArgTypes(type).map((t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (L.isSumType(type)) {
    return L.createSumType(
      recordMapValue(L.sumTypeVariantTypes(type), (t) =>
        substApplyToTypeWithBoundIds(boundIds, subst, t),
      ),
    )
  }

  if (L.isPolymorphicType(type)) {
    // - Be careful about the "name-capture" problem.
    type = L.polymorphicTypeFreshSelf(type)

    const varTypes = L.polymorphicTypeVarTypes(type)
    const bodyType = L.polymorphicTypeBodyType(type)

    return L.createPolymorphicType(
      varTypes,
      substApplyToTypeWithBoundIds(
        new Set([...boundIds, ...varTypes.map(L.varTypeId)]),
        subst,
        bodyType,
      ),
    )
  }

  let message = `[substApplyToTypeWithBoundIds] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
