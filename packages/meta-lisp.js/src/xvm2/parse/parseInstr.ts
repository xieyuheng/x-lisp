import * as S from "@xieyuheng/sexp.js"
import * as X2 from "../index.ts"
import { parseOperand } from "./parseOperand.ts"

export function parseInstr(sexp: S.Sexp): X2.Instr {
  if (S.isSymbolSexp(sexp)) {
    return X2.Instr("label", [X2.VarOperand(sexp.content)])
  }

  const list = S.asListSexp(sexp)
  const elements = list.elements
  if (elements.length === 0) {
    throw new S.ErrorWithSourceLocation(
      `[parseInstr] empty list is not an instr: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }

  const op = S.asSymbolSexp(elements[0]).content
  const operands = elements.slice(1).map((elem) => parseOperand(elem))
  return X2.Instr(op, operands)
}
