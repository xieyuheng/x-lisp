import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"
import { parseOperand } from "./parseOperand.ts"

export const parseInstr: S.Router<X86.Instr> = S.createRouter<X86.Instr>({
  "(cons* op operands)": ({ op, operands }, { location }) => {
    const opName = S.asSymbolSexp(op).content
    const ops = S.asListSexp(operands).elements.map((o) => parseOperand(o))
    return X86.Instr(opName, ops, location)
  },

  data: ({ data }, { location }) => {
    if (data.kind === "SymbolSexp") {
      return X86.Instr(
        "label",
        [X86.LabelOperand(data.content, [], location)],
        location,
      )
    }
    let message = `unexpected instr: ${S.formatSexp(data)}`
    throw new S.ErrorWithSourceLocation(message, location)
  },
})
