import * as S from "@xieyuheng/x-sexp.js"
import * as Operands from "../operand/index.ts"
import { type Operand } from "../operand/index.ts"

export function parseOperand(sexp: S.Sexp): Operand {
  return S.match(
    S.matcherChoice<Operand>([
      S.matcher("`(imm ,value)", ({ value }, { meta }) => {
        return Operands.Imm(S.numberContent(value), meta)
      }),

      S.matcher("`(var ,name)", ({ name }, { meta }) => {
        return Operands.Var(S.symbolContent(name), meta)
      }),

      S.matcher("`(reg ,name)", ({ name }, { meta }) => {
        return Operands.Reg(S.symbolContent(name), meta)
      }),

      S.matcher(
        "`(deref ,regName ,offset)",
        ({ regName, offset }, { meta }) => {
          return Operands.Deref(
            S.symbolContent(regName),
            S.numberContent(offset),
            meta,
          )
        },
      ),

      S.matcher("`(label ,name)", ({ name }, { meta }) => {
        return Operands.Label(S.symbolContent(name), meta)
      }),
    ]),
    sexp,
  )
}
