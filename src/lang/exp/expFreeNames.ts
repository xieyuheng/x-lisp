import { setAdd, setUnion, setUnionMany } from "../../utils/set/setAlgebra.ts"
import { isAtom } from "../value/index.ts"
import { type Exp, type MatchLine } from "./Exp.ts"

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
      return effectUnion([
        expFreeNames(exp.target),
        effectUnion(exp.args.map(expFreeNames)),
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
      return effectUnion([
        effectUnion(exp.elements.map(expFreeNames)),
        effectUnion(Object.values(exp.attributes).map(expFreeNames)),
      ])
    }

    case "Quote": {
      return identityEffect()
    }

    case "If": {
      return effectUnion([
        expFreeNames(exp.condition),
        expFreeNames(exp.consequent),
        expFreeNames(exp.alternative),
      ])
    }

    case "And": {
      return effectUnion(exp.exps.map(expFreeNames))
    }

    case "Or": {
      return effectUnion(exp.exps.map(expFreeNames))
    }

    case "Cond": {
      return effectUnion(
        exp.condLines.map((condLine) =>
          effectUnion([
            expFreeNames(condLine.question),
            expFreeNames(condLine.answer),
          ]),
        ),
      )
    }

    case "Match": {
      return effectUnion([
        expFreeNames(exp.target),
        ...exp.matchLines.map(matchLineFreeNames),
      ])
    }

    case "Union": {
      return effectUnion(exp.exps.map(expFreeNames))
    }

    case "Inter": {
      return effectUnion(exp.exps.map(expFreeNames))
    }

    case "Arrow": {
      return effectUnion([
        expFreeNames(exp.ret),
        effectUnion(exp.args.map(expFreeNames)),
      ])
    }
  }
}

function matchLineFreeNames(matchLine: MatchLine): Effect {
  return (boundNames) => {
    // We cheat by viewing all names in pattern as free names,
    // and use them as bound names in the body.
    const patternResult = expFreeNames(matchLine.pattern)(new Set())
    return expFreeNames(matchLine.body)(
      setUnion(boundNames, patternResult.freeNames),
    )
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

function effectUnion(effects: Array<Effect>): Effect {
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
