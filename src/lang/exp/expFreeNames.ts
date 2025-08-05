import { setUnion, setUnionMany } from "../../utils/set/setAlgebra.ts"
import { bindsToArray } from "../exp/index.ts"
import { isAtom } from "../value/index.ts"
import { type Exp } from "./index.ts"

type Effect = (boundNames: Set<string>) => {
  boundNames: Set<string>
  freeNames: Set<string>
}

export function expFreeNames(exp: Exp): Effect {
  if (isAtom(exp)) {
    return (boundNames) => ({ boundNames, freeNames: new Set() })
  }

  switch (exp.kind) {
    case "Var": {
      return (boundNames) => {
        if (boundNames.has(exp.name)) {
          return { boundNames, freeNames: new Set() }
        } else {
          return { boundNames, freeNames: new Set([exp.name]) }
        }
      }
    }

    case "Lambda": {
      return (boundNames) =>
        expFreeNames(exp.body)(new Set([...boundNames, exp.name]))
    }

    case "Apply": {
      return (boundNames) => ({
        boundNames,
        freeNames: new Set([
          ...expFreeNames(exp.target)(boundNames).freeNames,
          ...expFreeNames(exp.arg)(boundNames).freeNames,
        ]),
      })
    }

    case "Let": {
      return (boundNames) => {
        // NOTE All binds in the binds are independent.
        const binds = bindsToArray(exp.binds)
        const bindsFreeNames = binds
          .map((bind) =>
            Array.from(expFreeNames(bind.exp)(boundNames).freeNames),
          )
          .flatMap((names) => names)
        return {
          boundNames,
          freeNames: new Set([
            ...bindsFreeNames,
            ...expFreeNames(exp.body)(
              new Set([...boundNames, ...binds.map((bind) => bind.name)]),
            ).freeNames,
          ]),
        }
      }
    }

    case "Begin": {
      return (boundNames) => {
        return {
          boundNames,
          freeNames: setUnionMany(
            exp.sequence.map((e) => expFreeNames(e)(boundNames).freeNames),
          ),
        }
      }
    }

    case "Assign": {
      // TODO
      return expFreeNames(exp.rhs)
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
      return (boundNames) => ({ boundNames, freeNames: new Set() })
    }
  }
}
