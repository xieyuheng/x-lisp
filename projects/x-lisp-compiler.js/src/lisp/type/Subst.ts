import * as L from "../index.ts"

export type Subst = Map<number, L.Value>

export function emptySubst(): Subst {
  return new Map()
}
