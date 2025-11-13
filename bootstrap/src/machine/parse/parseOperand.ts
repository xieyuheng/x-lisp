import * as S from "@xieyuheng/x-sexp.js"
import * as Operands from "../operand/index.ts"
import { type Operand } from "../operand/index.ts"

export function parseOperand(sexp: S.Sexp): Operand {
  return S.match(
    S.matcherChoice<Operand>([
      S.matcher("`(imm ,value)", ({ value }, { meta }) => {
        return Operands.Imm(S.numberContent(value), meta)
      }),

      S.matcher("`(imm-label ,value)", ({ value }, { meta }) => {
        return Operands.ImmLabel(S.symbolContent(value), meta)
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

      S.matcher("`(deref-label ,label)", ({ label }, { meta }) => {
        return Operands.DerefLabel(S.symbolContent(label), meta)
      }),

      S.matcher("`(cc ,code)", ({ code }, { meta }) => {
        const conditionCode = S.symbolContent(code)
        if (!Operands.isConditionCode(conditionCode)) {
          let message = `[parseOperand] in valid condition code`
          message += `\n  code: ${conditionCode}`
          throw new S.ErrorWithMeta(message, meta)
        }

        return Operands.Cc(conditionCode, meta)
      }),

      S.matcher("label", ({ label }, { meta }) => {
        return Operands.Label(S.symbolContent(label), meta)
      }),
    ]),
    sexp,
  )
}
