import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as L from "../index.ts"

export type Subst = Map<string, L.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(varType: L.Value, type: L.Value): Subst {
  return new Map([[L.varTypeId(varType), type]])
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

  return L.typeTraverse((t) => substApplyToType(subst, t), type)
}

// export function extendSubst(
//   subst: Subst,
//   varType: L.Value,
//   type: L.Value,
// ): Subst {
//   // This implementation preserves the no-occurrence invariant, but it
//   // does not depend on, nor does it attempt to enforce it. That is
//   // the job of the unificaton.

//   type = substApplyToType(subst, type)

//   for (const [id, rhs] of subst) {
//     subst.set(id, substApplyToType(unitSubst(varType, type), rhs))
//   }
//    subst.set(L.varTypeId(varType), type)

//   return subst
// }

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
