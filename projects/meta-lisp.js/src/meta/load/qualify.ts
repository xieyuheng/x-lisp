import * as M from "../index.ts"

export function qualifyExp(scope: M.ModScope, exp: M.Exp): M.Exp {
  switch (exp.kind) {
    // case "Var": {
    //   if (exp.name === name) {
    //     return rhs
    //   } else {
    //     return exp
    //   }
    // }

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

    default: {
      return M.expTraverse((child) => qualifyExp(scope, child), exp)
    }
  }
}
