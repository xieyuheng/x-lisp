import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"

export function parseOperand(sexp: S.Sexp): B.Operand {
  if (S.isSymbolSexp(sexp)) {
    return B.VarOperand(sexp.content)
  }

  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])
  const elements = list.elements

  switch (head.content) {
    case "int64": {
      const value = S.asIntSexp(elements[1]).content
      return B.Int64Operand(value)
    }
    case "float64": {
      const value = S.asFloatSexp(elements[1]).content
      return B.Float64Operand(value)
    }
    case "bool": {
      const value = S.asSymbolSexp(elements[1]).content
      if (value !== "true" && value !== "false") {
        throw new S.ErrorWithSourceLocation(
          `[parseOperand] bool operand must be true or false, got: ${value}`,
          sexp.location,
        )
      }
      return B.BoolOperand(value === "true")
    }
    case "void": {
      return B.VoidOperand()
    }
    case "address": {
      const name = S.asSymbolSexp(elements[1]).content
      return B.AddressOperand(name)
    }
    default: {
      throw new S.ErrorWithSourceLocation(
        `[parseOperand] unknown operand form: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }
  }
}
