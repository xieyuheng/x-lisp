import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as L from "../index.ts"

export function typeTraverse(
  onType: (type: L.Value) => L.Value,
  type: L.Value,
): L.Value {
  if (L.isVarType(type)) {
    return onType(type)
  }

  if (L.isAnyType(type)) {
    return onType(type)
  }

  if (L.isLiteralType(type)) {
    return onType(type)
  }

  if (L.isAtomType(type)) {
    return onType(type)
  }

  if (L.isTauType(type)) {
    return L.createTauType(
      L.tauTypeElementTypes(type).map(onType),
      recordMapValue(L.tauTypeAttributeTypes(type), onType),
    )
  }

  if (L.isArrowType(type)) {
    return L.createArrowType(
      L.arrowTypeArgTypes(type).map(onType),
      onType(L.arrowTypeRetType(type)),
    )
  }

  if (L.isDatatypeType(type)) {
    return L.createDatatypeType(
      L.datatypeTypeDatatypeDefinition(type),
      L.datatypeTypeArgTypes(type).map(onType),
    )
  }

  if (L.isDisjointUnionType(type)) {
    return L.createDisjointUnionType(
      recordMapValue(L.disjointUnionTypeVariantTypes(type), onType),
    )
  }

  let message = `[typeMap] unhandled type`
  message += `\n  type: ${L.formatValue(type)}`
  throw new Error(message)
}
