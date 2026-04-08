import * as M from "../index.ts"

function qualifyVar(scope: M.ModScope, varExp: M.Var): M.Exp {
  // TODO
  return varExp
}

export function qualifyExp(scope: M.ModScope, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    case "Var": {
      return qualifyVar(scope, exp)
    }

    // no need to avoid free variable in lhs

    // case "Lambda": {
    //   const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
    //   return expFreeNames(newBoundNames, exp.body)
    // }

    // case "Polymorphic": {
    //   const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
    //   return expFreeNames(newBoundNames, exp.body)
    // }

    // case "Let1": {
    //   const newBoundNames = setAdd(boundNames, exp.name)
    //   return setUnionMany([
    //     expFreeNames(boundNames, exp.rhs),
    //     expFreeNames(newBoundNames, exp.body),
    //   ])
    // }

    // case "Match": {
    // }

    default: {
      return M.expTraverse((child) => qualifyExp(scope, child), exp)
    }
  }
}
