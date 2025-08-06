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
        return expFreeNames(exp.body)(setAdd(boundNames, exp.name))
      }
    }

    case "Apply": {
      return (boundNames) => {
        return {
          boundNames,
          freeNames: setUnion(
            expFreeNames(exp.target)(boundNames).freeNames,
            setUnionMany(
              exp.args.map((e) => expFreeNames(e)(boundNames).freeNames),
            ),
          ),
        }
      }
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
      return (boundNames) => {
        return {
          boundNames,
          freeNames: setUnion(
            setUnionMany(
              exp.elements.map(
                (element) => expFreeNames(element)(boundNames).freeNames,
              ),
            ),
            setUnionMany(
              Object.values(exp.attributes).map(
                (e) => expFreeNames(e)(boundNames).freeNames,
              ),
            ),
          ),
        }
      }
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
      return (boundNames) => {
        return {
          boundNames,
          freeNames: setUnionMany([
            expFreeNames(exp.condition)(boundNames).freeNames,
            expFreeNames(exp.consequent)(boundNames).freeNames,
            expFreeNames(exp.alternative)(boundNames).freeNames,
          ]),
        }
      }
    }

    case "And": {
      return (boundNames) => {
        return {
          boundNames,
          freeNames: setUnionMany(
            exp.exps.map((e) => expFreeNames(e)(boundNames).freeNames),
          ),
        }
      }
    }

    case "Or": {
      return (boundNames) => {
        return {
          boundNames,
          freeNames: setUnionMany(
            exp.exps.map((e) => expFreeNames(e)(boundNames).freeNames),
          ),
        }
      }
    }

    case "Cond": {
      return (boundNames) => {
        let freeNames = setUnionMany(
          exp.condLines.map((condLine) =>
            setUnion(
              expFreeNames(condLine.question)(boundNames).freeNames,
              expFreeNames(condLine.answer)(boundNames).freeNames,
            ),
          ),
        )

        return {
          boundNames,
          freeNames,
        }
      }
    }
  }
}
