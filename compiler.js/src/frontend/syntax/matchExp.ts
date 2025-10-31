import * as X from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function matchExp(sexp: X.Sexp): Exp {
  return X.match(expMatcher, sexp)
}

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher(
    "(cons* 'lambda parameters body)",
    ({ parameters, body }, { sexp }) => {
      const keyword = X.asTael(sexp).elements[0]
      const meta = X.tokenMetaFromSexpMeta(keyword.meta)
      return Exps.Lambda(
        X.listElements(parameters).map(X.symbolContent),
        Exps.Begin(X.listElements(body).map(matchExp), meta),
        meta,
      )
    },
  ),

  X.matcher(
    "`(if ,condition ,consequent ,alternative)",
    ({ condition, consequent, alternative }, { meta }) => {
      return Exps.If(
        matchExp(condition),
        matchExp(consequent),
        matchExp(alternative),
        meta,
      )
    },
  ),

  X.matcher("`(= ,lhs ,rhs)", ({ lhs, rhs }, { meta }) => {
    return Exps.Assign(matchExp(lhs), matchExp(rhs), meta)
  }),

  X.matcher("(cons* 'begin body)", ({ body }, { meta }) => {
    return Exps.Begin(X.listElements(body).map(matchExp), meta)
  }),

  X.matcher("(cons* target args)", ({ target, args }, { meta }) => {
    return Exps.Apply(
      matchExp(target),
      X.listElements(args).map(matchExp),
      meta,
    )
  }),

  X.matcher("data", ({ data }, { meta }) => {
    switch (data.kind) {
      case "Hashtag":
        return Exps.Hashtag(X.hashtagContent(data), meta)
      case "Int":
        return Exps.Int(X.numberContent(data), meta)
      case "Float":
        return Exps.Float(X.numberContent(data), meta)
      case "String":
        return Exps.String(X.stringContent(data), meta)
      case "Symbol": {
        return Exps.Var(X.symbolContent(data), meta)
      }
    }
  }),
])
