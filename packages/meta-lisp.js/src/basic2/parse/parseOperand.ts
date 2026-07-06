import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"

export function parseOperand(sexp: S.Sexp): B.Operand {
  if (S.isSymbolSexp(sexp)) {
    return B.VarOperand(sexp.content)
  }

  throw new S.ErrorWithSourceLocation(
    `[parseOperand] expected symbol (SSA var), got: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}
