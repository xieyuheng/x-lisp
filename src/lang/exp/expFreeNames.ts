import { setAdd, setUnion, setUnionMany } from "../../utils/set/setAlgebra.ts"
import { bindsToArray } from "../exp/index.ts"
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

    case "Let": {
      return (boundNames) => {
        // NOTE All binds in the binds are independent.
        const binds = bindsToArray(exp.binds)
        const bindsFreeNames = new Set(
          binds
            .map((bind) =>
              Array.from(expFreeNames(bind.exp)(boundNames).freeNames),
            )
            .flatMap((names) => names),
        )

        return {
          boundNames,
          freeNames: setUnion(
            bindsFreeNames,
            expFreeNames(exp.body)(
              setUnion(boundNames, new Set(binds.map((bind) => bind.name))),
            ).freeNames,
          ),
        }
      }
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

    case "Union": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Inter": {
      return effectUnionMany(exp.exps.map(expFreeNames))
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
