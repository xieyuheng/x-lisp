import * as S from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export const parseExp: S.Router<Exp> = S.createRouter<Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[0]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Exps.Lambda(
      S.listElements(parameters).map(S.symbolContent),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "`(@quote ,sexp)": ({ sexp }, { meta }) => {
    return Exps.Quote(sexp, meta)
  },

  "`(if ,condition ,consequent ,alternative)": (
    { condition, consequent, alternative },
    { meta },
  ) => {
    return Exps.If(
      parseExp(condition),
      parseExp(consequent),
      parseExp(alternative),
      meta,
    )
  },

  "(cons* 'when condition body)": ({ condition, body }, { meta }) => {
    return Exps.When(
      parseExp(condition),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'unless condition body)": ({ condition, body }, { meta }) => {
    return Exps.Unless(
      parseExp(condition),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },

  "(cons* 'and exps)": ({ exps }, { meta }) => {
    return Exps.And(S.listElements(exps).map(parseExp), meta)
  },

  "(cons* 'or exps)": ({ exps }, { meta }) => {
    return Exps.Or(S.listElements(exps).map(parseExp), meta)
  },

  "(cons* 'assert exps)": ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 1) {
      const message = "(assert) must take one argument\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Assert(args[0], meta)
  },

  "(cons* 'assert-equal exps)": ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 2) {
      const message = "(assert-equal) must take two arguments\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    const [lhs, rhs] = args
    return Exps.AssertEqual(lhs, rhs, meta)
  },

  "(cons* 'assert-not-equal exps)": ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.AssertNotEqual(args[0], args[1], meta)
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { meta }) => {
    return Exps.AssignSugar(S.symbolContent(name), parseExp(rhs), meta)
  },

  "(cons* 'begin body)": ({ body }, { meta }) => {
    return Exps.BeginSugar(S.listElements(body).map(parseExp), meta)
  },

  "(cons* target args)": ({ target, args }, { meta }) => {
    return Exps.Apply(
      parseExp(target),
      S.listElements(args).map(parseExp),
      meta,
    )
  },

  data: ({ data }, { meta }) => {
    switch (data.kind) {
      case "Hashtag":
        return Exps.Hashtag(S.hashtagContent(data), meta)
      case "Int":
        return Exps.Int(S.intContent(data), meta)
      case "Float":
        return Exps.Float(S.floatContent(data), meta)
      case "String":
        return Exps.String(S.stringContent(data), meta)
      case "Symbol": {
        return Exps.Var(S.symbolContent(data), meta)
      }
    }
  },
})
