import * as S from "@xieyuheng/sexp.js"
import { Instr } from "../instr/index.ts"
import { parseOperand } from "./parseOperand.ts"

export function parseInstr(sexp: S.Sexp): Instr {
  return S.match(
    S.matcherChoice<Instr>([
      S.matcher("(cons* op operands)", ({ op, operands }, { meta }) => {
        return Instr(
          S.symbolContent(op),
          S.listElements(operands).map(parseOperand),
          meta,
        )
      }),
    ]),
    sexp,
  )
}
