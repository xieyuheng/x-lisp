import * as S from "@xieyuheng/x-sexp.js"
import * as Operands from "../operand/index.ts"
import { type Operand } from "../operand/index.ts"

export function parseOperand(sexp: S.Sexp): Operand {
  return S.match(
    S.matcherChoice<Operand>([
      S.matcher("`(imm ,value)", ({ value }, { meta }) => {
        return Operands.Imm(S.numberContent(value), meta)
      }),

      S.matcher("`(imm-label ,label)", ({ label }, { meta }) => {
        return Operands.ImmLabel(Operands.asLabel(parseOperand(label)), meta)
      }),

      S.matcher("`(var ,name)", ({ name }, { meta }) => {
        return Operands.Var(S.symbolContent(name), meta)
      }),

      S.matcher("`(reg ,name)", ({ name }, { meta }) => {
        return Operands.Reg(S.symbolContent(name), meta)
      }),

      S.matcher(
        "`(deref-reg ,reg ,offset)",
        ({ reg, offset }, { meta }) => {
          return Operands.DerefReg(
            Operands.asReg(parseOperand(reg)),
            S.numberContent(offset),
            meta,
          )
        },
      ),

      S.matcher("`(deref-label ,label)", ({ label }, { meta }) => {
        return Operands.DerefLabel(Operands.asLabel(parseOperand(label)), meta)
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

      S.matcher("`(arity ,value)", ({ value }, { meta }) => {
        return Operands.Arity(S.numberContent(value), meta)
      }),

      S.matcher("`(label ,name)", ({ name }, { meta }) => {
        return Operands.Label(S.symbolContent(name), meta)
      }),
    ]),
    sexp,
  )
}
