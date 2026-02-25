import { mapMapValue } from "@xieyuheng/helpers.js/map"
import * as L from "../index.ts"

export type Subst = Map<bigint, L.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(serialNumber: bigint, type: L.Value): Subst {
  return new Map([[serialNumber, type]])
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

  return L.typeTraverse((type) => substApplyToType(subst, type), type)
}

export function extendSubst(
  subst: Subst,
  serialNumber: bigint,
  type: L.Value,
): Subst {
  // This implementation preserves the no-occurrence invariant, but it
  // does not depend on, nor does it attempt to enforce it. That is
  // the job of the unificaton.

  return mapMapValue(subst, (rhs) =>
    substApplyToType(unitSubst(serialNumber, type), rhs),
  ).set(serialNumber, type)
}
