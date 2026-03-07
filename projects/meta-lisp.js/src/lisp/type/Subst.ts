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
  // the job of the unificaton.

  type = substApplyToType(subst, type)

  return mapMapValue(subst, (rhs) =>
    substApplyToType(unitSubst(varType, type), rhs),
  ).set(L.varTypeId(varType), type)
}

export function substApplyToType(subst: Subst, type: L.Value): L.Value {
  if (L.isVarType(type)) {
    const id = L.varTypeId(type)
    const found = subst.get(id)
    return found || type
  }

  if (L.isAnyType(type)) {
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
      L.tauTypeElementTypes(type).map((t) => substApplyToType(subst, t)),
    )
  }

  if (L.isClassType(type)) {
    return L.createClassType(
      recordMapValue(L.classTypeAttributeTypes(type), (t) =>
        substApplyToType(subst, t),
      ),
    )
  }

  if (L.isArrowType(type)) {
    return L.createArrowType(
      L.arrowTypeArgTypes(type).map((t) => substApplyToType(subst, t)),
      substApplyToType(subst, L.arrowTypeRetType(type)),
    )
  }

  if (L.isListType(type)) {
    return L.createListType(
      substApplyToType(subst, L.listTypeElementType(type)),
    )
  }

  if (L.isSetType(type)) {
    return L.createSetType(substApplyToType(subst, L.setTypeElementType(type)))
  }

  if (L.isHashType(type)) {
    return L.createHashType(
      substApplyToType(subst, L.hashTypeKeyType(type)),
      substApplyToType(subst, L.hashTypeValueType(type)),
    )
  }

  if (L.isDatatypeType(type)) {
    return L.createDatatypeType(
      L.datatypeTypeDatatypeDefinition(type),
      L.datatypeTypeArgTypes(type).map((t) => substApplyToType(subst, t)),
    )
  }

  if (L.isDisjointUnionType(type)) {
    return L.createDisjointUnionType(
      recordMapValue(L.disjointUnionTypeVariantTypes(type), (t) =>
        substApplyToType(subst, t),
      ),
    )
  }

  if (L.isPolymorphicType(type)) {
    return substApplyToType(subst, L.polymorphicTypeUnfold(type))
  }

  let message = `[substApplyToType] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
