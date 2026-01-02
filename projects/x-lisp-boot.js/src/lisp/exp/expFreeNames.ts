import { setAdd, setUnion, setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import { type Exp } from "./Exp.ts"

export function expFreeNames(boundNames: Set<string>, exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return new Set()
    }

    case "FunctionRef":
    case "ConstantRef": {
      return new Set()
    }

    case "Var": {
      if (boundNames.has(exp.name)) {
        return new Set()
      } else {
        return new Set([exp.name])
      }
    }

    case "Lambda": {
      const newBoundNames = setUnion(boundNames, new Set(exp.parameters))
      return expFreeNames(newBoundNames, exp.body)
    }

    case "ApplyNullary": {
      return setUnionMany([expFreeNames(boundNames, exp.target)])
    }

    case "Apply": {
      return setUnionMany([
        expFreeNames(boundNames, exp.target),
        expFreeNames(boundNames, exp.arg),
      ])
    }

    case "Let1": {
      const newBoundNames = setAdd(boundNames, exp.name)
      return setUnionMany([
        expFreeNames(boundNames, exp.rhs),
        expFreeNames(newBoundNames, exp.body),
      ])
    }

    case "If": {
      return setUnionMany([
        expFreeNames(boundNames, exp.condition),
        expFreeNames(boundNames, exp.consequent),
        expFreeNames(boundNames, exp.alternative),
      ])
    }

    default: {
      let message = `[expFreeNames] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
