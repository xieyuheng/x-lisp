import * as S from "@xieyuheng/sexp.js"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function parseValue(sexp: S.Sexp): Value {
  return S.match(valueMatcher, sexp)
}

const valueMatcher: S.Matcher<Value> = S.matcherChoice<Value>([
  S.matcher("`(@function ,name ,arity)", ({ name, arity }, { meta }) => {
    return Values.Function(S.symbolContent(name), S.numberContent(arity), {
      isPrimitive: false,
    })
  }),

  S.matcher("`(@address ,name)", ({ name }, { meta }) => {
    return Values.Address(S.symbolContent(name), { isPrimitive: false })
  }),

  S.matcher("`(@primitive-address ,name)", ({ name }, { meta }) => {
    return Values.Address(S.symbolContent(name), { isPrimitive: true })
  }),

  S.matcher(
    "`(@primitive-function ,name ,arity)",
    ({ name, arity }, { meta }) => {
      return Values.Function(S.symbolContent(name), S.numberContent(arity), {
        isPrimitive: true,
      })
    },
  ),

  S.matcher("else", ({}, { sexp }) => {
    const meta = S.tokenMetaFromSexpMeta(sexp.meta)

    switch (sexp.kind) {
      case "Hashtag": {
        return Values.Hashtag(S.hashtagContent(sexp))
      }

      case "Int": {
        return Values.Int(S.numberContent(sexp))
      }

      case "Float": {
        return Values.Float(S.numberContent(sexp))
      }

      default: {
        let message = `[matchValue] unknown sexp`
        message += `\n  sexp: #${S.formatSexp(sexp)}`
        throw new S.ErrorWithMeta(message, meta)
      }
    }
  }),
])
