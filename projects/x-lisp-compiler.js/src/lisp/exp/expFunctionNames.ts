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

    case "Apply": {
      return setUnionMany([
        expFunctionNames(exp.target),
        ...exp.args.map((arg) => expFunctionNames(arg)),
      ])
    }

    case "Let1": {
      return setUnionMany([
        expFunctionNames(exp.rhs),
        expFunctionNames(exp.body),
      ])
    }

    case "Begin1": {
      return setUnionMany([
        expFunctionNames(exp.head),
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

    case "Assert": {
      return expFunctionNames(exp.target)
    }

    case "AssertEqual": {
      return setUnionMany([
        expFunctionNames(exp.lhs),
        expFunctionNames(exp.rhs),
      ])
    }

    case "AssertNotEqual": {
      return setUnionMany([
        expFunctionNames(exp.lhs),
        expFunctionNames(exp.rhs),
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
