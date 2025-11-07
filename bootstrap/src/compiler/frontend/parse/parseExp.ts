import * as X from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function parseExp(sexp: X.Sexp): Exp {
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
        Exps.BeginSugar(X.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  X.matcher(
    "`(if ,condition ,consequent ,alternative)",
    ({ condition, consequent, alternative }, { meta }) => {
      return Exps.If(
        parseExp(condition),
        parseExp(consequent),
        parseExp(alternative),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'when condition body)", ({ condition, body }, { meta }) => {
    return Exps.When(
      parseExp(condition),
      Exps.BeginSugar(X.listElements(body).map(parseExp), meta),
      meta,
    )
  }),

  X.matcher(
    "(cons* 'unless condition body)",
    ({ condition, body }, { meta }) => {
      return Exps.Unless(
        parseExp(condition),
        Exps.BeginSugar(X.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'and exps)", ({ exps }, { meta }) => {
    return Exps.And(X.listElements(exps).map(parseExp), meta)
  }),

  X.matcher("(cons* 'or exps)", ({ exps }, { meta }) => {
    return Exps.Or(X.listElements(exps).map(parseExp), meta)
  }),

  X.matcher("`(= ,name ,rhs)", ({ name, rhs }, { meta }) => {
    return Exps.AssignSugar(X.symbolContent(name), parseExp(rhs), meta)
  }),

  X.matcher("(cons* 'begin body)", ({ body }, { meta }) => {
    return Exps.BeginSugar(X.listElements(body).map(parseExp), meta)
  }),

  X.matcher("(cons* target args)", ({ target, args }, { meta }) => {
    return Exps.Apply(
      parseExp(target),
      X.listElements(args).map(parseExp),
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
