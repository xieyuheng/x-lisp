import { mapMapValue } from "@xieyuheng/helpers.js/map"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"

export type Subst = Map<string, L.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(varType: L.Value, type: L.Value): Subst {
  return new Map([[L.varTypeId(varType), type]])
}

export function extendSubst(
  subst: Subst,
  varType: L.Value,
  type: L.Value,
): Subst {
  // This implementation preserves the no-occurrence invariant, but it
  // does not depend on, nor does it attempt to enforce it. That is
  // the job of the unification.

  type = substApplyToType(subst, type)

  return mapMapValue(subst, (rhs) =>
    substApplyToType(unitSubst(varType, type), rhs),
  ).set(L.varTypeId(varType), type)
}

export function substApplyToType(subst: Subst, type: L.Value): L.Value {
  return substApplyToTypeWithBoundIds(new Set(), subst, type)
}

export function substLookup(subst: Subst, id: string): L.Value | undefined {
  return subst.get(id)
}

export function substLength(subst: Subst): number {
  return subst.size
}

export function substApplyToTypeWithBoundIds(
  boundIds: Set<string>,
  subst: Subst,
  type: L.Value,
): L.Value {
  if (L.isVarType(type)) {
    const id = L.varTypeId(type)
    if (boundIds.has(id)) {
      return type
    }

    const found = substLookup(subst, id)
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

  if (L.isClassType(type)) {
    return L.createClassType(
      recordMapValue(L.classTypeAttributeTypes(type), (t) =>
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
    const varTypes = L.polymorphicTypeVarTypes(type)
    return L.createPolymorphicType(
      varTypes,
      substApplyToTypeWithBoundIds(
        new Set([...boundIds, ...varTypes.map(L.varTypeId)]),
        subst,
        L.polymorphicTypeBodyType(type),
      ),
    )
  }

  let message = `[substApplyToTypeWithBoundIds] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
