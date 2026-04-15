import * as M from "../index.ts"
import { mapMapValue } from "@xieyuheng/helpers.js/map"
import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"

export function substExtend(
  subst: M.Subst,
  varType: M.Value,
  type: M.Value,
): M.Subst {
  // - This implementation preserves the no-occurrence invariant, but
  //   it does not depend on, nor does it attempt to enforce it. That
  //   is the job of the unification.
  if (subst.has(M.varTypeId(varType))) {
    let message = `[extendSubst] type variable already in subst`
    message += `\n  type variable: ${M.formatType(varType)}`
    throw new Error(message)
  }

  type = M.substApplyToType(subst, type)

  // - The following code is about subst composition,
  //   like (subst-compose unit-subst subst)。
  return mapMapValue(subst, (rhs) =>
    M.substApplyToType(M.unitSubst(varType, type), rhs),
  ).set(M.varTypeId(varType), type)
}

export function substExtendMany(
  subst: M.Subst,
  varTypes: Array<M.Value>,
  types: Array<M.Value>,
): M.Subst {
  assert(varTypes.length === types.length)
  for (const i of range(varTypes.length)) {
    subst = substExtend(subst, varTypes[i], types[i])
  }

  return subst
}
