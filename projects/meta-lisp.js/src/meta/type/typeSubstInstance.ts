import * as M from "../index.ts"

// - lhs is substitution instance of rhs
// - for example:
//   A -> A   is a substitution instance of    B -> C
//   B -> C   is not substitution instance of  A -> A

export function typeSubstInstance(lhs: M.Type, rhs: M.Type): boolean {
  const subst = M.typeUnify(M.emptySubst(), M.typeReify(lhs), rhs)
  return subst !== undefined
}
