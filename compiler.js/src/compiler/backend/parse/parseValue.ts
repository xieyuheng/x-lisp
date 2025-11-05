import * as X from "@xieyuheng/x-sexp.js"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function parseValue(sexp: X.Sexp): Value {
  return X.match(valueMatcher, sexp)
}

const valueMatcher: X.Matcher<Value> = X.matcherChoice<Value>([
  X.matcher("`(@function ,name ,arity)", ({ name, arity }, { meta }) => {
    return Values.FunctionRef(X.symbolContent(name), X.numberContent(arity))
  }),

  X.matcher("else", ({}, { sexp }) => {
    const meta = X.tokenMetaFromSexpMeta(sexp.meta)

    switch (sexp.kind) {
      case "Hashtag": {
        return Values.Hashtag(X.hashtagContent(sexp))
      }

      case "Int": {
        return Values.Int(X.numberContent(sexp))
      }

      case "Float": {
        return Values.Float(X.numberContent(sexp))
      }

      default: {
        let message = `[matchValue] unknown sexp`
        message += `\n  sexp: #${X.formatSexp(sexp)}`
        throw new X.ErrorWithMeta(message, meta)
      }
    }
  }),
])
