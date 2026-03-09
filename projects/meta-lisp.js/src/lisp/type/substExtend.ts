import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as L from "../index.ts"

export function substExtend(
  subst: L.Subst,
  varType: L.Value,
  type: L.Value,
): L.Subst {
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
    L.substApplyToType(L.unitSubst(varType, type), rhs),
  ).set(L.varTypeId(varType), type)
}
