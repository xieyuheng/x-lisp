import { setUnion, setUnionMany } from "../../utils/set/setAlgebra.ts"
import { bindsToArray } from "../exp/index.ts"
import { isAtom } from "../value/Atom.ts"
import { type Exp } from "./index.ts"

export function expFreeNames(boundNames: Set<string>, exp: Exp): Set<string> {
  if (isAtom(exp)) {
    return new Set()
  }

  switch (exp.kind) {
    case "Var": {
      return boundNames.has(exp.name) ? new Set() : new Set([exp.name])
    }

    case "Lambda": {
      return expFreeNames(new Set([...boundNames, exp.name]), exp.ret)
    }

    case "Apply": {
      return new Set([
        ...expFreeNames(boundNames, exp.target),
        ...expFreeNames(boundNames, exp.arg),
      ])
    }

    case "Let": {
      // NOTE All binds in the binds are independent.
      const binds = bindsToArray(exp.binds)
      const bindsFreeNames = binds
        .map((bind) => Array.from(expFreeNames(boundNames, bind.exp)))
        .flatMap((names) => names)
      return new Set([
        ...bindsFreeNames,
        ...expFreeNames(
          new Set([...boundNames, ...binds.map((bind) => bind.name)]),
          exp.body,
        ),
      ])
    }

    case "Tael": {
      return setUnion(
        setUnionMany(
          exp.elements.map((element) => expFreeNames(boundNames, element)),
        ),
        setUnionMany(
          Object.values(exp.attributes).map((e) => expFreeNames(boundNames, e)),
        ),
      )
    }
  }
}
