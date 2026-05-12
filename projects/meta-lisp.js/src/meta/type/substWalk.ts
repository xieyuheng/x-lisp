import * as M from "../index.ts"

export function substWalk(subst: M.Subst, type: M.Type): M.Type {
  if (type.kind === "VarType") {
    const found = M.substLookup(subst, M.varTypeId(type))
    if (found) {
      return substWalk(subst, found)
    }
  }

  return type
}
