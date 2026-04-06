import { type Exp } from "./Exp.ts"
import { expTraverse } from "./index.ts"

export function expSubstitute(name: string, rhs: Exp, exp: Exp): Exp {
  switch (exp.kind) {
    case "Var": {
      if (exp.name === name) {
        return rhs
      } else {
        return exp
      }
    }

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
      return expTraverse((child) => expSubstitute(name, rhs, child), exp)
    }
  }
}
