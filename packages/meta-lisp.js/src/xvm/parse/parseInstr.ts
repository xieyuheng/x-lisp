import * as S from "@xieyuheng/sexp.js"
import * as Xvm2 from "../index.ts"
import { parseOperand } from "./parseOperand.ts"

export function parseInstr(sexp: S.Sexp): Xvm2.Instr {
  if (S.isSymbolSexp(sexp)) {
    return Xvm2.Instr("label", [Xvm2.VarOperand(sexp.content)])
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
  return Xvm2.Instr(op, operands)
}
