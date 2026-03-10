import { arrayDedup } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"

// - To implement `typeReify`.
// - Can not handle `PolymorphicType`,
//   should call `typeFreshen` before call this function.

type Effect = (subst: L.Subst) => L.Subst

export function typeCanonicalLabelSubst(type: L.Value): Effect {
  return (subst) => {
    const freeVarTypes = arrayDedup(L.typeFreeVarTypes(new Set(), type), L.varTypeEqual)
    for (const freeVarType of freeVarTypes) {
      const serialNumber = BigInt(L.substLength(subst)) + 1n
      subst = L.substExtend(
        subst,
        freeVarType,
        L.createCanonicalLabelType(serialNumber),
      )
    }

    return subst
  }
}

// export function typeCanonicalLabelSubst(type: L.Value): Effect {
//   if (L.isVarType(type)) {
//     return (subst) => {
//       const id = L.varTypeId(type)
//       const found = L.substLookup(subst, id)
//       if (found) {
//         return subst
//       } else {
//         const serialNumber = BigInt(L.substLength(subst)) + 1n
//         return L.substExtend(
//           subst,
//           type,
//           L.createCanonicalLabelType(serialNumber),
//         )
//       }
//     }
//   }

//   if (L.isCanonicalLabelType(type)) {
//     return identityEffect
//   }

//   if (L.isTypeType(type)) {
//     return identityEffect
//   }

//   if (L.isLiteralType(type)) {
//     return identityEffect
//   }

//   if (L.isAtomType(type)) {
//     return identityEffect
//   }

//   if (L.isArrowType(type)) {
//     return sequenceEffect(
//       [...L.arrowTypeArgTypes(type), L.arrowTypeRetType(type)].map(
//         typeCanonicalLabelSubst,
//       ),
//     )
//   }

//   if (L.isTauType(type)) {
//     return sequenceEffect(
//       L.tauTypeElementTypes(type).map(typeCanonicalLabelSubst),
//     )
//   }

//   if (L.isClassType(type)) {
//     return sequenceEffect(
//       Object.values(L.classTypeAttributeTypes(type)).map(
//         typeCanonicalLabelSubst,
//       ),
//     )
//   }

//   if (L.isListType(type)) {
//     return typeCanonicalLabelSubst(L.listTypeElementType(type))
//   }

//   if (L.isSetType(type)) {
//     return typeCanonicalLabelSubst(L.setTypeElementType(type))
//   }

//   if (L.isHashType(type)) {
//     return sequenceEffect(
//       [L.hashTypeKeyType(type), L.hashTypeValueType(type)].map(
//         typeCanonicalLabelSubst,
//       ),
//     )
//   }

//   if (L.isDatatypeType(type)) {
//     return sequenceEffect(
//       L.datatypeTypeArgTypes(type).map(typeCanonicalLabelSubst),
//     )
//   }

//   if (L.isSumType(type)) {
//     return sequenceEffect(
//       Object.values(L.sumTypeVariantTypes(type)).map(typeCanonicalLabelSubst),
//     )
//   }

//   let message = `[typeCanonicalLabelSubst] unhandled type`
//   message += `\n  type: ${L.formatType(type)}`
//   throw new Error(message)
// }

// function identityEffect(subst: L.Subst): L.Subst {
//   return subst
// }

// function sequenceEffect(effects: Array<Effect>): Effect {
//   if (effects.length === 0) {
//     return identityEffect
//   }

//   const [effect, ...restEffects] = effects

//   if (restEffects.length === 0) {
//     return effect
//   }

//   return (subst) => sequenceEffect(restEffects)(effect(subst))
// }
