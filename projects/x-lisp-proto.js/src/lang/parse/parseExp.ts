import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export const parseExp: S.Router<Exp> = S.createRouter<Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[0]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)

    if (S.isSymbol(parameters)) {
      return Exps.VariadicLambda(
        S.symbolContent(parameters),
        Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      )
    }

    if (S.listElements(parameters).length === 0) {
      return Exps.NullaryLambda(
        Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      )
    }

    return Exps.Lambda(
      S.listElements(parameters).map(parseExp),
      Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    )
  },
  "`(@quote ,sexp)": ({ sexp }, { meta }) => {
    return Exps.Quote(sexp, meta)
  },
  "(cons* '@comment sexps)": ({ sexps }, { meta }) => {
    return Exps.Comment(S.listElements(sexps), meta)
  },

  "`(@quasiquote ,sexp)": ({ sexp }, { meta }) => {
    return Exps.Quasiquote(sexp, meta)
  },

  "`(@pattern ,pattern)": ({ pattern }, { meta }) => {
    return Exps.Pattern(parseExp(pattern), meta)
  },

  "`(polymorphic ,parameters ,schema)": ({ parameters, schema }, { meta }) => {
    return Exps.Polymorphic(
      S.listElements(parameters).map(S.symbolContent),
      parseExp(schema),
      meta,
    )
  },
  "(cons* 'specific target args)": ({ target, args }, { meta }) => {
    return Exps.Specific(
      parseExp(target),
      S.listElements(args).map(parseExp),
      meta,
    )
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

  "(cons* '-> exps)": ({ exps }, { meta }) => {
    const [argSchemas, retSchema] = arrayPickLast(
      S.listElements(exps).map(parseExp),
    )
    return Exps.Arrow(argSchemas, retSchema, meta)
  },

  "`(*-> ,argSchema ,retSchema)": ({ argSchema, retSchema }, { meta }) => {
    return Exps.VariadicArrow(parseExp(argSchema), parseExp(retSchema), meta)
  },

  "(cons* 'assert exps)": ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 1) {
      const message = "(assert) must take one argument\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Assert(args[0], meta)
  },

  "(cons* 'assert-not exps)": ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 1) {
      const message = "(assert-not) must take one argument\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.AssertNot(args[0], meta)
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

  "(cons* 'assert-the exps)": ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.AssertThe(args[0], args[1], meta)
  },

  "`(= ,lhs ,rhs)": ({ lhs, rhs }, { meta }) => {
    return Exps.Assign(parseExp(lhs), parseExp(rhs), meta)
  },

  "`(the ,schema ,exp)": ({ schema, exp }, { meta }) => {
    return Exps.The(parseExp(schema), parseExp(exp), meta)
  },

  "(cons* '@tael elements)": ({ elements }, { sexp, meta }) => {
    return Exps.Tael(
      S.listElements(elements).map(parseExp),
      recordMapValue(S.asTael(sexp).attributes, parseExp),
      meta,
    )
  },

  "(cons* '@list elements)": ({ elements }, { sexp, meta }) => {
    if (Object.keys(S.asTael(sexp).attributes).length > 0) {
      let message = `(@list) literal list can not have attributes`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Tael(S.listElements(elements).map(parseExp), {}, meta)
  },

  "(cons* '@record elements)": ({ elements }, { sexp, meta }) => {
    if (S.listElements(elements).length > 0) {
      let message = `(@record) literal record can not have elements`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Tael(
      [],
      recordMapValue(S.asTael(sexp).attributes, parseExp),
      meta,
    )
  },

  "(cons* '@set elements)": ({ elements }, { sexp, meta }) => {
    if (Object.keys(S.asTael(sexp).attributes).length > 0) {
      let message = `(@set) can not have attributes`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Set(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@hash elements)": ({ elements }, { sexp, meta }) => {
    if (Object.keys(S.asTael(sexp).attributes).length > 0) {
      let message = `(@hash) can not have attributes`
      throw new S.ErrorWithMeta(message, meta)
    }

    if (S.listElements(elements).length % 2 === 1) {
      let message = `(@hash) body length must be even`
      throw new S.ErrorWithMeta(message, meta)
    }

    const entries = arrayGroup2(S.listElements(elements)).map(
      ([key, value]) => ({
        key: parseExp(key),
        value: parseExp(value),
      }),
    )
    return Exps.Hash(entries, meta)
  },

  "(cons* 'tau elements)": ({ elements }, { sexp, meta }) => {
    return Exps.Tau(
      S.listElements(elements).map(parseExp),
      recordMapValue(S.asTael(sexp).attributes, parseExp),
      meta,
    )
  },

  "(cons* 'begin body)": ({ body }, { meta }) => {
    return Exps.BeginSugar(S.listElements(body).map(parseExp), meta)
  },

  "(cons* 'cond lines)": ({ lines }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Exps.Cond(S.listElements(lines).map(parseCondLine), meta)
  },

  "(cons* 'match target lines)": ({ target, lines }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Exps.Match(
      parseExp(target),
      S.listElements(lines).map(parseMatchLine),
      meta,
    )
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

const parseCondLine = S.createRouter<Exps.CondLine>({
  "(cons* question body)": ({ question, body }, { meta }) => {
    if (question.kind === "Symbol" && question.content === "else") {
      return {
        question: Exps.Hashtag("t", meta),
        answer: Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      }
    } else {
      return {
        question: parseExp(question),
        answer: Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      }
    }
  },
})

const parseMatchLine = S.createRouter<Exps.MatchLine>({
  "(cons* pattern body)": ({ pattern, body }, { meta }) => {
    return {
      pattern: parseExp(pattern),
      body: Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
    }
  },
})
