import * as S from "@xieyuheng/sexp.js"
import { Instr } from "../instr/index.ts"
import { parseOperand } from "./parseOperand.ts"

export const parseInstr = S.createRouter<Instr>({
  "(cons* op operands)": ({ op, operands }, { meta }) => {
    return Instr(
      S.symbolContent(op),
      S.listElements(operands).map(parseOperand),
      meta,
    )
  },
})
