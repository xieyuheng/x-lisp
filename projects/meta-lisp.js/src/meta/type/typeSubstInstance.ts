import * as M from "../index.ts"

export function typeSubstInstance(lhs: M.Type, rhs: M.Type): boolean {
  const subst = M.typeUnify(M.emptySubst(), M.typeReify(lhs), rhs)
  return subst !== undefined
}
