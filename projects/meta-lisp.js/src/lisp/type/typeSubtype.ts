import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"
import { trailLoopOccurred, type Trail } from "./Trail.ts"
import { typeEquivalent } from "./typeEquivalent.ts"

export function typeSubtype(trail: Trail, lhs: L.Value, rhs: L.Value): boolean {
  if (trailLoopOccurred(trail, lhs, rhs)) {
    return true
  }

  if (typeEquivalent([], lhs, rhs)) {
    return true
  }

  if (L.isTauType(lhs) && L.isTauType(rhs)) {
    return typeSubtypeMany(
      trail,
      L.tauTypeElementTypes(lhs),
      L.tauTypeElementTypes(rhs),
    )
  }

  if (L.isClassType(lhs) && L.isClassType(rhs)) {
    const lhsRecord = L.classTypeAttributeTypes(lhs)
    const rhsRecord = L.classTypeAttributeTypes(rhs)
    // rhs has less keys
    for (const k of Object.keys(rhsRecord)) {
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) {
        return false
      }
    }

    return true
  }

  if (L.isArrowType(lhs) && L.isArrowType(rhs)) {
    // contravariant on ArgTypes
    lhs = L.arrowTypeNormalize(lhs)
    rhs = L.arrowTypeNormalize(rhs)
    return (
      typeSubtypeMany(
        trail,
        L.arrowTypeArgTypes(rhs),
        L.arrowTypeArgTypes(lhs),
      ) && typeSubtype(trail, L.arrowTypeRetType(lhs), L.arrowTypeRetType(rhs))
    )
  }

  if (L.isListType(lhs) && L.isListType(rhs)) {
    return typeSubtype(
      trail,
      L.listTypeElementType(lhs),
      L.listTypeElementType(rhs),
    )
  }

  if (L.isSetType(lhs) && L.isSetType(rhs)) {
    return typeSubtype(
      trail,
      L.setTypeElementType(lhs),
      L.setTypeElementType(rhs),
    )
  }

  if (L.isHashType(lhs) && L.isHashType(rhs)) {
    // key type is invariant
    return (
      typeEquivalent([], L.hashTypeKeyType(lhs), L.hashTypeKeyType(rhs)) &&
      typeSubtype(trail, L.hashTypeValueType(lhs), L.hashTypeValueType(rhs))
    )
  }

  if (L.isDatatypeType(lhs) && L.isDatatypeType(rhs)) {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(
      trail,
      L.datatypeTypeUnfold(lhs),
      L.datatypeTypeUnfold(rhs),
    )
  }

  if (L.isDatatypeType(lhs)) {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, L.datatypeTypeUnfold(lhs), rhs)
  }

  if (L.isDatatypeType(rhs)) {
    trail = [...trail, [lhs, rhs]]

    return typeSubtype(trail, lhs, L.datatypeTypeUnfold(rhs))
  }

  if (L.isSumType(lhs) && L.isSumType(rhs)) {
    const lhsRecord = L.sumTypeVariantTypes(lhs)
    const rhsRecord = L.sumTypeVariantTypes(rhs)
    // lhs has less keys
    for (const k of Object.keys(lhsRecord)) {
      if (!typeSubtype(trail, lhsRecord[k], rhsRecord[k])) {
        return false
      }
    }

    return true
  }

  if (L.isSumType(rhs)) {
    const variantTypes = L.sumTypeVariantTypes(rhs)
    for (const variantType of Object.values(variantTypes)) {
      if (typeSubtype(trail, lhs, variantType)) {
        return true
      }
    }
  }

  // TODO maybe call `typeUnify` in `typeSubtype`.

  // if (L.isPolymorphicType(lhs) && L.isPolymorphicType(rhs)) {
  //   lhs = L.polymorphicTypeFreshen(lhs)
  //   rhs = L.polymorphicTypeFreshen(rhs)
  //   const subst = L.typeUnify(L.emptySubst(), lhs, rhs)
  //   if (subst === undefined) return false

  //   lhs = L.substApplyToType(subst, lhs)
  //   rhs = L.substApplyToType(subst, rhs)
  //   return typeSubtype(trail, lhs, rhs)
  // }

  // if (L.isPolymorphicType(lhs)) {
  //   lhs = L.polymorphicTypeFreshen(lhs)
  //   const subst = L.typeUnify(L.emptySubst(), lhs, rhs)
  //   if (subst === undefined) return false

  //   lhs = L.substApplyToType(subst, lhs)
  //   rhs = L.substApplyToType(subst, rhs)
  //   return typeSubtype(trail, lhs, rhs)
  // }

  // if (L.isPolymorphicType(rhs)) {
  //   rhs = L.polymorphicTypeFreshen(rhs)
  //   const subst = L.typeUnify(L.emptySubst(), lhs, rhs)
  //   if (subst === undefined) return false

  //   lhs = L.substApplyToType(subst, lhs)
  //   rhs = L.substApplyToType(subst, rhs)
  //   return typeSubtype(trail, lhs, rhs)
  // }

  return false
}

function typeSubtypeMany(
  trail: Trail,
  lhs: Array<L.Value>,
  rhs: Array<L.Value>,
): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => typeSubtype(trail, l, r))
  )
}
