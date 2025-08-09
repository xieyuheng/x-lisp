import { setAdd, setUnion, setUnionMany } from "../../utils/set/setAlgebra.ts"
import { isAtom } from "../value/index.ts"
import { type Exp } from "./index.ts"

type Result = { boundNames: Set<string>; freeNames: Set<string> }
type Effect = (boundNames: Set<string>) => Result

export function expFreeNames(exp: Exp): Effect {
  if (isAtom(exp)) {
    return (boundNames) => {
      return {
        boundNames,
        freeNames: new Set(),
      }
    }
  }

  switch (exp.kind) {
    case "Var": {
      return (boundNames) => {
        if (boundNames.has(exp.name)) {
          return {
            boundNames,
            freeNames: new Set(),
          }
        } else {
          return {
            boundNames,
            freeNames: new Set([exp.name]),
          }
        }
      }
    }

    case "Lambda": {
      return (boundNames) => {
        return expFreeNames(exp.body)(
          setUnion(boundNames, new Set(exp.parameters)),
        )
      }
    }

    case "Apply": {
      return effectUnion(
        expFreeNames(exp.target),
        effectUnionMany(exp.args.map(expFreeNames)),
      )
    }

    case "Begin": {
      return (boundNames) => {
        let freeNames = new Set<string>()
        for (const e of exp.sequence) {
          const result = expFreeNames(e)(boundNames)
          boundNames = result.boundNames
          freeNames = setUnion(freeNames, result.freeNames)
        }

        return {
          boundNames,
          freeNames,
        }
      }
    }

    case "Assign": {
      return (boundNames) => {
        const rhsResult = expFreeNames(exp.rhs)(boundNames)
        return {
          boundNames: setAdd(rhsResult.boundNames, exp.name),
          freeNames: rhsResult.freeNames,
        }
      }
    }

    case "Assert": {
      return expFreeNames(exp.exp)
    }

    case "Tael": {
      return effectUnion(
        effectUnionMany(exp.elements.map(expFreeNames)),
        effectUnionMany(Object.values(exp.attributes).map(expFreeNames)),
      )
    }

    case "Quote": {
      return (boundNames) => {
        return {
          boundNames,
          freeNames: new Set(),
        }
      }
    }

    case "If": {
      return effectUnionMany([
        expFreeNames(exp.condition),
        expFreeNames(exp.consequent),
        expFreeNames(exp.alternative),
      ])
    }

    case "And": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Or": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Cond": {
      return effectUnionMany(
        exp.condLines.map((condLine) =>
          effectUnion(
            expFreeNames(condLine.question),
            expFreeNames(condLine.answer),
          ),
        ),
      )
    }

    case "Match": {
      // We cheat here, by viewing
      // all names in pattern as bound names.
      throw new Error("TODO")
    }

    case "Union": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Inter": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Arrow": {
      return effectUnion(
        expFreeNames(exp.ret),
        effectUnionMany(exp.args.map(expFreeNames)),
      )
    }
  }
}

// combinators

function effectUnionMany(effects: Array<Effect>): Effect {
  return (boundNames) => {
    return {
      boundNames,
      freeNames: setUnionMany(
        effects.map((effect) => effect(boundNames).freeNames),
      ),
    }
  }
}

function effectUnion(lhs: Effect, rhs: Effect): Effect {
  return (boundNames) => {
    return {
      boundNames,
      freeNames: setUnion(lhs(boundNames).freeNames, rhs(boundNames).freeNames),
    }
  }
}
