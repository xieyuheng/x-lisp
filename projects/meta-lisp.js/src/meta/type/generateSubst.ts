import { arrayDedup } from "@xieyuheng/helpers.js/array"
import * as M from "../index.ts"

// - To implement `typeReify`.

export function generateCanonicalLabelSubst(types: Array<M.Type>): M.Subst {
  const freeVarTypes: Array<M.VarType> = arrayDedup(
    types.flatMap((type) => M.typeFreeVarTypes(new Set(), type)),
    M.varTypeEqual,
  ) as Array<M.VarType>

  let subst = M.emptySubst()
  for (const freeVarType of freeVarTypes) {
    const serialNumber = BigInt(M.substLength(subst)) + 1n
    const canonicalLabelType = M.CanonicalLabelType(serialNumber)
    subst = M.substExtend(subst, freeVarType, canonicalLabelType)
  }

  return subst
}

// - To improve error report.

export function generatePrettyUnknownSubst(types: Array<M.Type>): M.Subst {
  const freeVarTypes: Array<M.VarType> = arrayDedup(
    types.flatMap((type) => M.typeFreeVarTypes(new Set(), type)),
    M.varTypeEqual,
  ) as Array<M.VarType>

  let subst = M.emptySubst()
  for (const freeVarType of freeVarTypes) {
    const prettyName = M.generatePrettyTypeVariableName(M.substLength(subst))
    const prettyUnknown = M.VarType(prettyName, BigInt(0))
    subst = M.substExtend(subst, freeVarType, prettyUnknown)
  }

  return subst
}
