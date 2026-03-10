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
    const canonicalLabelType = L.createCanonicalLabelType(serialNumber)
    subst = L.substExtend(subst, freeVarType, canonicalLabelType)
  }

  return subst
}

// - To improve error report.

export function generatePrettyUnknownSubst(types: Array<L.Value>): L.Subst {
  let subst = L.emptySubst()
  const freeVarTypes = arrayDedup(
    types.flatMap(type => L.typeFreeVarTypes(new Set(), type)),
    L.varTypeEqual,
  )

  for (const freeVarType of freeVarTypes) {
    const prettyName = L.generatePrettyTypeVariableName(L.substLength(subst))
    const prettyUnknown = L.createVarType(prettyName, BigInt(0))
    subst = L.substExtend(subst, freeVarType, prettyUnknown)
  }

  return subst
}
