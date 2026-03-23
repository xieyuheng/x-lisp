import * as M from "../index.ts"

export type Subst = Map<string, M.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(varType: M.Value, type: M.Value): Subst {
  return new Map([[M.varTypeId(varType), type]])
}

export function substLookup(subst: Subst, id: string): M.Value | undefined {
  return subst.get(id)
}

export function substLength(subst: Subst): number {
  return subst.size
}
