import * as S from "@xieyuheng/sexp.js"
import * as Operands from "../operand/index.ts"
import { type Operand } from "../operand/index.ts"

export const parseOperand: S.Router<Operand> = S.createRouter<Operand>({
  "`(imm ,value)": ({ value }, { meta }) => {
    return Operands.Imm(S.intContent(value), meta)
  },

  "`(label-imm ,label)": ({ label }, { meta }) => {
    return Operands.LabelImm(Operands.asLabel(parseOperand(label)), meta)
  },

  "`(var ,name)": ({ name }, { meta }) => {
    return Operands.Var(S.symbolContent(name), meta)
  },

  "`(reg ,name)": ({ name }, { meta }) => {
    return Operands.Reg(S.symbolContent(name), meta)
  },

  "`(reg-deref ,reg ,offset)": ({ reg, offset }, { meta }) => {
    return Operands.RegDeref(
      Operands.asReg(parseOperand(reg)),
      Number(S.intContent(offset)),
      meta,
    )
  },

  "`(label-deref ,label)": ({ label }, { meta }) => {
    return Operands.LabelDeref(Operands.asLabel(parseOperand(label)), meta)
  },

  "`(cc ,code)": ({ code }, { meta }) => {
    const conditionCode = S.symbolContent(code)
    if (!Operands.isConditionCode(conditionCode)) {
      let message = `[parseOperand] in valid condition code`
      message += `\n  code: ${conditionCode}`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Operands.Cc(conditionCode, meta)
  },

  "`(arity ,value)": ({ value }, { meta }) => {
    return Operands.Arity(Number(S.intContent(value)), meta)
  },

  "`(label ,name)": ({ name }, { meta }) => {
    return Operands.Label(S.symbolContent(name), { isExternal: false }, meta)
  },

  "`(external-label ,name)": ({ name }, { meta }) => {
    return Operands.Label(S.symbolContent(name), { isExternal: true }, meta)
  },
})
