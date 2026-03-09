import { mapMapValue } from "@xieyuheng/helpers.js/map"
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
  // - This implementation preserves the no-occurrence invariant, but
  //   it does not depend on, nor does it attempt to enforce it. That
  //   is the job of the unification.

  if (subst.has(L.varTypeId(varType))) {
    let message = `[extendSubst] type variable already in subst`
    message += `\n  type variable: ${L.formatType(varType)}`
    throw new Error(message)
  }

  type = L.substApplyToType(subst, type)

  // - The following code is about subst composition,
  //   like (subst-compose unit-subst subst)。
  return mapMapValue(subst, (rhs) =>
    L.substApplyToType(unitSubst(varType, type), rhs),
  ).set(L.varTypeId(varType), type)
}

export function substLookup(subst: Subst, id: string): L.Value | undefined {
  return subst.get(id)
}

export function substLength(subst: Subst): number {
  return subst.size
}
