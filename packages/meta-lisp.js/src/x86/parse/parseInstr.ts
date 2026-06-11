import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"
import { parseOperand } from "./parseOperand.ts"

export const parseInstr: S.Router<N.Instr> = S.createRouter<N.Instr>({
  "(cons* op operands)": ({ op, operands }, { location }) => {
    const opName = S.asSymbolSexp(op).content
    const ops = S.asListSexp(operands).elements.map((o) => parseOperand(o))
    return N.Instr(opName, ops, location)
  },

  data: ({ data }, { location }) => {
    if (data.kind === "SymbolSexp") {
      return N.Instr(
        "label",
        [N.LabelOperand(data.content, [], location)],
        location,
      )
    }
    throw new S.ErrorWithSourceLocation(
      `unexpected instr: ${S.formatSexp(data)}`,
      location,
    )
  },
})
