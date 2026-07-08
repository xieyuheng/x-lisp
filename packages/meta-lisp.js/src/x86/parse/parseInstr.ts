import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"
import { parseOperand } from "./parseOperand.ts"

export const parseInstr: S.Router<X86.Instr> = S.createRouter<X86.Instr>({
  "(cons* op operands)": ({ op, operands }, { location }) => {
    const opName = S.asSymbolSexp(op).content
    if (opName === "label") {
      let message =
        "(label ...) cannot be an instruction; labels are defined by blocks"
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }
    const ops = S.asListSexp(operands).elements.map((o) => parseOperand(o))
    return X86.Instr(opName, ops
    )
  },
})
