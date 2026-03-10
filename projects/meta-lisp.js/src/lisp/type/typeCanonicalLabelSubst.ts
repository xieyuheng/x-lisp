import { arrayDedup } from "@xieyuheng/helpers.js/array"
import * as L from "../index.ts"

// - To implement `typeReify`.

export function typeCanonicalLabelSubst(type: L.Value): L.Subst {
  let subst = L.emptySubst()
  const freeVarTypes = arrayDedup(
    L.typeFreeVarTypes(new Set(), type),
    L.varTypeEqual,
  )
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
