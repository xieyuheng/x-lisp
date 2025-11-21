import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/x-sexp.js"
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
  ),

  S.matcher("`(@quote ,sexp)", ({ sexp }, { meta }) => {
    return Exps.Quote(sexp, meta)
  }),

  S.matcher("(cons* '@comment sexps)", ({ sexps }, { meta }) => {
    return Exps.Comment(S.listElements(sexps), meta)
  }),

  S.matcher("`(@quasiquote ,sexp)", ({ sexp }, { meta }) => {
    return Exps.Quasiquote(sexp, meta)
  }),

  S.matcher("`(@pattern ,pattern)", ({ pattern }, { meta }) => {
    return Exps.Pattern(parseExp(pattern), meta)
  }),

  S.matcher(
    "`(polymorphic ,parameters ,schema)",
    ({ parameters, schema }, { meta }) => {
      return Exps.Polymorphic(
        S.listElements(parameters).map(S.symbolContent),
        parseExp(schema),
        meta,
      )
    },
  ),

  S.matcher("(cons* 'specific target args)", ({ target, args }, { meta }) => {
    return Exps.Specific(
      parseExp(target),
      S.listElements(args).map(parseExp),
      meta,
    )
  }),

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

  S.matcher("(cons* '-> exps)", ({ exps }, { meta }) => {
    const [argSchemas, retSchema] = arrayPickLast(
      S.listElements(exps).map(parseExp),
    )
    return Exps.Arrow(argSchemas, retSchema, meta)
  }),

  S.matcher(
    "`(*-> ,argSchema ,retSchema)",
    ({ argSchema, retSchema }, { meta }) => {
      return Exps.VariadicArrow(parseExp(argSchema), parseExp(retSchema), meta)
    },
  ),

  S.matcher("(cons* 'assert exps)", ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 1) {
      const message = "(assert) must take one argument\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Assert(args[0], meta)
  }),

  S.matcher("(cons* 'assert-not exps)", ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 1) {
      const message = "(assert-not) must take one argument\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.AssertNot(args[0], meta)
  }),

  S.matcher("(cons* 'assert-equal exps)", ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 2) {
      const message = "(assert-equal) must take two arguments\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    const [lhs, rhs] = args
    return Exps.AssertEqual(lhs, rhs, meta)
  }),

  S.matcher("(cons* 'assert-not-equal exps)", ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.AssertNotEqual(args[0], args[1], meta)
  }),

  S.matcher("(cons* 'assert-the exps)", ({ exps }, { meta }) => {
    const args = S.listElements(exps).map(parseExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.AssertThe(args[0], args[1], meta)
  }),

  S.matcher("`(= ,lhs ,rhs)", ({ lhs, rhs }, { meta }) => {
    return Exps.Assign(parseExp(lhs), parseExp(rhs), meta)
  }),

  S.matcher("`(the ,schema ,exp)", ({ schema, exp }, { meta }) => {
    return Exps.The(parseExp(schema), parseExp(exp), meta)
  }),

  S.matcher("(cons* '@tael elements)", ({ elements }, { sexp, meta }) => {
    return Exps.Tael(
      S.listElements(elements).map(parseExp),
      recordMapValue(S.asTael(sexp).attributes, parseExp),
      meta,
    )
  }),

  S.matcher("(cons* '@list elements)", ({ elements }, { sexp, meta }) => {
    if (Object.keys(S.asTael(sexp).attributes).length > 0) {
      let message = `(@list) literal list can not have attributes`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Tael(S.listElements(elements).map(parseExp), {}, meta)
  }),

  S.matcher("(cons* '@record elements)", ({ elements }, { sexp, meta }) => {
    if (S.listElements(elements).length > 0) {
      let message = `(@record) literal record can not have elements`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Tael(
      [],
      recordMapValue(S.asTael(sexp).attributes, parseExp),
      meta,
    )
  }),

  S.matcher("(cons* '@set elements)", ({ elements }, { sexp, meta }) => {
    if (Object.keys(S.asTael(sexp).attributes).length > 0) {
      let message = `(@set) can not have attributes`
      throw new S.ErrorWithMeta(message, meta)
    }

    return Exps.Set(S.listElements(elements).map(parseExp), meta)
  }),

  S.matcher("(cons* '@hash elements)", ({ elements }, { sexp, meta }) => {
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
  }),

  S.matcher("(cons* 'tau elements)", ({ elements }, { sexp, meta }) => {
    return Exps.Tau(
      S.listElements(elements).map(parseExp),
      recordMapValue(S.asTael(sexp).attributes, parseExp),
      meta,
    )
  }),

  S.matcher("(cons* 'begin body)", ({ body }, { meta }) => {
    return Exps.BeginSugar(S.listElements(body).map(parseExp), meta)
  }),

  S.matcher("(cons* 'cond lines)", ({ lines }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Exps.Cond(S.listElements(lines).map(matchCondLine), meta)
  }),

  S.matcher("(cons* 'match target lines)", ({ target, lines }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Exps.Match(
      parseExp(target),
      S.listElements(lines).map(matchMatchLine),
      meta,
    )
  }),

  S.matcher("(cons* target args)", ({ target, args }, { meta }) => {
    return Exps.Apply(
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

export function matchCondLine(sexp: S.Sexp): Exps.CondLine {
  return S.match(
    S.matcher("(cons* question body)", ({ question, body }, { meta }) => {
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
    }),
    sexp,
  )
}

export function matchMatchLine(sexp: S.Sexp): Exps.MatchLine {
  return S.match(
    S.matcher("(cons* pattern body)", ({ pattern, body }, { meta }) => {
      return {
        pattern: parseExp(pattern),
        body: Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
      }
    }),
    sexp,
  )
}
