import * as L from "../index.ts"

// - lhs is substitution instance of rhs
// - for example:
//   A -> A   is a substitution instance of    B -> C
//   B -> C   is not substitution instance of  A -> A

export function typeSubstInstance(lhs: L.Value, rhs: L.Value): boolean {
  const subst = L.typeUnify([], L.emptySubst(), L.typeReify(lhs), rhs)
  return subst !== undefined
}
