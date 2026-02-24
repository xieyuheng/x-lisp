import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"

export type Subst = Map<bigint, L.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function substApplyToType(subst: Subst, type: L.Value): L.Value {
  if (L.isVarType(type)) {
    const serialNumber = L.varTypeSerialNumber(type)
    const found = subst.get(serialNumber)
    if (found) {
      return found
    } else {
      return type
    }
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
      L.tauTypeElementTypes(type).map((elementType) =>
        substApplyToType(subst, elementType),
      ),
      recordMapValue(L.tauTypeAttributeTypes(type), (attributeType) =>
        substApplyToType(subst, attributeType),
      ),
    )
  }

  if (L.isArrowType(type)) {
    return L.createArrowType(
      L.arrowTypeArgTypes(type).map((argType) =>
        substApplyToType(subst, argType),
      ),
      substApplyToType(subst, L.arrowTypeRetType(type)),
    )
  }

  if (L.isDatatypeType(type)) {
    return L.createDatatypeType(
      L.datatypeTypeDatatypeDefinition(type),
      L.datatypeTypeArgTypes(type).map((argType) =>
        substApplyToType(subst, argType),
      ),
    )
  }

  if (L.isDisjointUnionType(type)) {
    return L.createDisjointUnionType(
      recordMapValue(L.disjointUnionTypeVariantTypes(type), (variantType) =>
        substApplyToType(subst, variantType),
      ),
    )
  }

  let message = `[substApplyToType] unhandled type`
  message += `\n  type: ${L.formatValue(type)}`
  throw new Error(message)
}
