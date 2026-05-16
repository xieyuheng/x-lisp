import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as M from "../index.ts"

export type Subst = Map<string, M.Type>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(varType: M.VarType, type: M.Type): Subst {
  return new Map([[M.varTypeId(varType), type]])
}

export function substExtend(
  subst: Subst,
  varType: M.VarType,
  type: M.Type,
): M.Subst {
  if (subst.has(M.varTypeId(varType))) {
    let message = `[substExtend] type variable already in subst`
    message += `\n  type variable: ${M.formatType(varType)}`
    throw new Error(message)
  }

  return new Map([...subst, [M.varTypeId(varType), type]])
}

export function substExtendMany(
  subst: Subst,
  varTypes: Array<M.VarType>,
  types: Array<M.Type>,
): M.Subst {
  assert(varTypes.length === types.length)
  for (const i of range(varTypes.length)) {
    subst = substExtend(subst, varTypes[i], types[i])
  }

  return subst
}

export function substLookup(subst: Subst, id: string): M.Type | undefined {
  return subst.get(id)
}

export function substLength(subst: Subst): number {
  return subst.size
}
