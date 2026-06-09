import { range } from "@xieyuheng/helpers.js/range"
import assert from "node:assert"
import * as M from "../index.ts"

export type Subst = EmptySubst | ConsSubst

type EmptySubst = {
  kind: "EmptySubst"
  length: 0
}

type ConsSubst = {
  kind: "ConsSubst"
  id: string
  type: M.Type
  rest: Subst
  length: number
}

export function EmptySubst(): EmptySubst {
  return { kind: "EmptySubst", length: 0 }
}

export function ConsSubst(
  id: string,
  type: M.Type,
  rest: Subst,
): ConsSubst {
  return { kind: "ConsSubst", id, type, rest, length: rest.length + 1 }
}

export function emptySubst(): EmptySubst {
  return EmptySubst()
}

export function unitSubst(varType: M.VarType, type: M.Type): Subst {
  return ConsSubst(M.varTypeId(varType), type, EmptySubst())
}

export function substExtend(
  subst: Subst,
  varType: M.VarType,
  type: M.Type,
): Subst {
  const id = M.varTypeId(varType)
  let cursor: Subst = subst
  while (cursor.kind === "ConsSubst") {
    if (cursor.id === id) {
      let message = `[substExtend] type variable already in subst`
      message += `\n  type variable: ${M.formatType(varType)}`
      throw new Error(message)
    }
    cursor = cursor.rest
  }

  return ConsSubst(id, type, subst)
}

export function substExtendMany(
  subst: Subst,
  varTypes: Array<M.VarType>,
  types: Array<M.Type>,
): Subst {
  assert(varTypes.length === types.length)
  for (const i of range(varTypes.length)) {
    subst = substExtend(subst, varTypes[i], types[i])
  }

  return subst
}

export function substLookup(subst: Subst, id: string): M.Type | undefined {
  while (subst.kind === "ConsSubst") {
    if (subst.id === id) return subst.type
    subst = subst.rest
  }
  return undefined
}

export function substLength(subst: Subst): number {
  return subst.length
}
