import * as M from "../index.ts"

export function substWalk(subst: M.Subst, type: M.Value): M.Value {
  if (M.isVarType(type)) {
    const found = M.substLookup(subst, M.varTypeId(type))
    if (found) {
      return substWalk(subst, found)
    } else {
      return type
    }
  } else {
    return type
  }
}
