import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"

export function parseOperand(sexp: S.Sexp): B.Cell {
  if (S.isSymbolSexp(sexp)) {
    return B.Cell(sexp.content)
  }

  throw new S.ErrorWithSourceLocation(
    `[parseOperand] expected symbol (SSA var), got: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}
