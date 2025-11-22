import * as S from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function parseExp(sexp: S.Sexp): Exp {
  return S.match(expMatcher, sexp)
}

const expMatcher: S.Matcher<Exp> = S.matcherChoice<Exp>([
  S.matcher(
    "(cons* 'lambda parameters body)",
    ({ parameters, body }, { sexp }) => {
      const keyword = S.asTael(sexp).elements[0]
      const meta = S.tokenMetaFromSexpMeta(keyword.meta)
      return Exps.Lambda(
        S.listElements(parameters).map(S.symbolContent),
        Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  S.matcher(
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

  S.matcher("(cons* 'when condition body)", ({ condition, body }, { meta }) => {
    return Exps.When(
      parseExp(condition),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  }),

  S.matcher(
    "(cons* 'unless condition body)",
    ({ condition, body }, { meta }) => {
      return Exps.Unless(
        parseExp(condition),
        Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  S.matcher("(cons* 'and exps)", ({ exps }, { meta }) => {
    return Exps.And(S.listElements(exps).map(parseExp), meta)
  }),

  S.matcher("(cons* 'or exps)", ({ exps }, { meta }) => {
    return Exps.Or(S.listElements(exps).map(parseExp), meta)
  }),

  S.matcher("`(= ,name ,rhs)", ({ name, rhs }, { meta }) => {
    return Exps.AssignSugar(S.symbolContent(name), parseExp(rhs), meta)
  }),

  S.matcher("(cons* 'begin body)", ({ body }, { meta }) => {
    return Exps.BeginSugar(S.listElements(body).map(parseExp), meta)
  }),

  S.matcher("(cons* target args)", ({ target, args }, { meta }) => {
    return Exps.ApplySugar(
      parseExp(target),
      S.listElements(args).map(parseExp),
      meta,
    )
  }),

  S.matcher("data", ({ data }, { meta }) => {
    switch (data.kind) {
      case "Hashtag":
        return Exps.Hashtag(S.hashtagContent(data), meta)
      case "Int":
        return Exps.Int(S.numberContent(data), meta)
      case "Float":
        return Exps.Float(S.numberContent(data), meta)
      case "String":
        return Exps.String(S.stringContent(data), meta)
      case "Symbol": {
        return Exps.Var(S.symbolContent(data), meta)
      }
    }
  }),
])
