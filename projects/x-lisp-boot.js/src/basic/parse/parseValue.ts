import * as S from "@xieyuheng/sexp.js"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export const parseValue = S.createRouter<Value>({
  "`(@function ,name ,arity)": ({ name, arity }, { meta }) => {
    return Values.FunctionRef(
      S.symbolContent(name),
      Number(S.intContent(arity)),
      {
        isPrimitive: false,
      },
    )
  },

  "`(@address ,name)": ({ name }, { meta }) => {
    return Values.Address(S.symbolContent(name), { isPrimitive: false })
  },

  "`(@primitive-address ,name)": ({ name }, { meta }) => {
    return Values.Address(S.symbolContent(name), { isPrimitive: true })
  },

  "`(@primitive-function ,name ,arity)": ({ name, arity }, { meta }) => {
    return Values.FunctionRef(
      S.symbolContent(name),
      Number(S.intContent(arity)),
      {
        isPrimitive: true,
      },
    )
  },

  else: ({}, { sexp }) => {
    const meta = S.tokenMetaFromSexpMeta(sexp.meta)

    switch (sexp.kind) {
      case "Hashtag": {
        return Values.Hashtag(S.hashtagContent(sexp))
      }

      case "Int": {
        return Values.Int(S.intContent(sexp))
      }

      case "Float": {
        return Values.Float(S.floatContent(sexp))
      }

      default: {
        let message = `[matchValue] unknown sexp`
        message += `\n  sexp: #${S.formatSexp(sexp)}`
        throw new S.ErrorWithMeta(message, meta)
      }
    }
  },
})
