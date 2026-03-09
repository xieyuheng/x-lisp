import * as L from "../index.ts"

export type Subst = Map<string, L.Value>

export function emptySubst(): Subst {
  return new Map()
}

export function unitSubst(varType: L.Value, type: L.Value): Subst {
  return new Map([[L.varTypeId(varType), type]])
}

export function substLookup(subst: Subst, id: string): L.Value | undefined {
  return subst.get(id)
}

export function substLength(subst: Subst): number {
  return subst.size
}
