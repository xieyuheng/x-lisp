import { setUnionMany } from "@xieyuheng/helpers.js/set"
import * as S from "@xieyuheng/sexp.js"
import { formatExp } from "../format/index.ts"
import { type Exp } from "./Exp.ts"

export function expFunctionNames(exp: Exp): Set<string> {
  switch (exp.kind) {
    case "Symbol":
    case "Hashtag":
    case "String":
    case "Int":
    case "Float": {
      return new Set()
    }

    case "FunctionRef": {
      return new Set([exp.name])
    }

    case "ConstantRef": {
      return new Set()
    }

    case "Var": {
      return new Set()
    }

    case "Lambda": {
      return expFunctionNames(exp.body)
    }

    case "ApplyNullary": {
      return setUnionMany([expFunctionNames(exp.target)])
    }

    case "Apply": {
      return setUnionMany([
        expFunctionNames(exp.target),
        expFunctionNames(exp.arg),
      ])
    }

    case "Let1": {
      return setUnionMany([
        expFunctionNames(exp.rhs),
        expFunctionNames(exp.body),
      ])
    }

    case "If": {
      return setUnionMany([
        expFunctionNames(exp.condition),
        expFunctionNames(exp.consequent),
        expFunctionNames(exp.alternative),
      ])
    }

    default: {
      let message = `[expFunctionNames] unhandled exp`
      message += `\n  exp: ${formatExp(exp)}`
      if (exp.meta) throw new S.ErrorWithMeta(message, exp.meta)
      else throw new Error(message)
    }
  }
}
