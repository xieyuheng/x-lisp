import { setAdd, setUnion, setUnionMany } from "../../utils/set/setAlgebra.ts"
import { isAtom } from "../value/index.ts"
import { type Exp } from "./index.ts"

type Result = { boundNames: Set<string>; freeNames: Set<string> }
type Effect = (boundNames: Set<string>) => Result

export function expFreeNames(exp: Exp): Effect {
  if (isAtom(exp)) {
    return identityEffect()
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
      return effectUnionMany([
        expFreeNames(exp.target),
        effectUnionMany(exp.args.map(expFreeNames)),
      ])
    }

    case "Begin": {
      return effectSequence(exp.sequence.map(expFreeNames))
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
      return effectUnionMany([
        effectUnionMany(exp.elements.map(expFreeNames)),
        effectUnionMany(Object.values(exp.attributes).map(expFreeNames)),
      ])
    }

    case "Quote": {
      return identityEffect()
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
          effectUnionMany([
            expFreeNames(condLine.question),
            expFreeNames(condLine.answer),
          ]),
        ),
      )
    }

    case "Match": {
      // We cheat by viewing all names (all free names)
      // in pattern as bound names.
      return effectUnionMany(
        exp.matchLines.map((matchLine) =>
          effectSequence([
            effectInverse(expFreeNames(matchLine.pattern)),
            expFreeNames(matchLine.body),
          ]),
        ),
      )
    }

    case "Union": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Inter": {
      return effectUnionMany(exp.exps.map(expFreeNames))
    }

    case "Arrow": {
      return effectUnionMany([
        expFreeNames(exp.ret),
        effectUnionMany(exp.args.map(expFreeNames)),
      ])
    }
  }
}

// combinators

function identityEffect(): Effect {
  return (boundNames) => {
    return {
      boundNames,
      freeNames: new Set(),
    }
  }
}

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

function effectSequence(effects: Array<Effect>): Effect {
  return (boundNames) => {
    let freeNames = new Set<string>()
    for (const effect of effects) {
      const result = effect(boundNames)
      boundNames = result.boundNames
      freeNames = setUnion(freeNames, result.freeNames)
    }

    return {
      boundNames,
      freeNames,
    }
  }
}

function effectInverse(effect: Effect): Effect {
  return (boundNames) => {
    const result = effect(boundNames)
    return {
      boundNames: result.freeNames,
      freeNames: result.boundNames,
    }
  }
}
