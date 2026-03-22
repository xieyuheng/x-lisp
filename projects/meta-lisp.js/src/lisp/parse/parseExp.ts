import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import assert from "node:assert"
import * as L from "../index.ts"

export function parseBody(body: S.Sexp): L.Exp {
  const elements = S.listElements(body).map(parseExp)
  if (elements.length === 1) {
    return elements[0]
  } else {
    return L.BeginSugar(elements, body.meta)
  }
}

export const parseExp: S.Router<L.Exp> = S.createRouter<L.Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return L.Lambda(
      S.listElements(parameters).map(S.symbolContent),
      parseBody(body),
      meta,
    )
  },

  "`(@quote ,sexp)": ({ sexp }, { meta }) => {
    return L.Quote(sexp, meta)
  },

  "`(if ,condition ,consequent ,alternative)": (
    { condition, consequent, alternative },
    { meta },
  ) => {
    return L.If(
      parseExp(condition),
      parseExp(consequent),
      parseExp(alternative),
      meta,
    )
  },

  "(cons* 'when condition body)": ({ condition, body }, { meta }) => {
    return L.When(parseExp(condition), parseBody(body), meta)
  },

  "(cons* 'unless condition body)": ({ condition, body }, { meta }) => {
    return L.Unless(parseExp(condition), parseBody(body), meta)
  },

  "(cons* 'and exps)": ({ exps }, { meta }) => {
    return L.And(S.listElements(exps).map(parseExp), meta)
  },

  "(cons* 'or exps)": ({ exps }, { meta }) => {
    return L.Or(S.listElements(exps).map(parseExp), meta)
  },

  "(cons* 'cond clauses)": ({ clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return L.Cond(S.listElements(clauses).map(parseCondClause), keyword.meta)
  },

  "(cons* 'match target clauses)": ({ target, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return L.Match(
      [parseExp(target)],
      S.listElements(clauses).map(parseMatchClause),
      meta,
    )
  },

  "(cons* 'match-many targets clauses)": ({ targets, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return L.Match(
      S.listElements(targets).map(parseExp),
      S.listElements(clauses).map(parseMatchManyClause),
      meta,
    )
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { meta }) => {
    return L.AssignSugar(S.symbolContent(name), parseExp(rhs), meta)
  },

  "(cons* 'begin body)": ({ body }, { meta }) => {
    return parseBody(body)
  },

  "(cons* '@list elements)": ({ elements }, { meta }) => {
    return L.LiteralList(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@tuple elements)": ({ elements }, { meta }) => {
    return L.LiteralTuple(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@record body)": ({ body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    for (const [key, group] of Object.entries(
      Object.groupBy(entries, ([key, sexp]) => key),
    )) {
      if (group && group.length > 1) {
        const [_, firstSexp] = group[1]
        assert(firstSexp.meta)
        let message = `[parseExp] duplicated key in literal (@record)`
        message += `\n  key: ${key}`
        throw new S.ErrorWithMeta(message, firstSexp.meta)
      }
    }

    return L.LiteralRecord(
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* '@set elements)": ({ elements }, { meta }) => {
    return L.LiteralSet(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@hash elements)": ({ elements }, { meta }) => {
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
    return L.LiteralHash(entries, meta)
  },

  "(cons* '-> exps)": ({ exps }, { meta }) => {
    const [argTypes, retType] = arrayPickLast(
      S.listElements(exps).map(parseExp),
    )
    return L.Arrow(argTypes, retType, meta)
  },

  "(cons* 'tau elements)": ({ elements }, { meta }) => {
    return L.Tau(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* 'interface body)": ({ body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    for (const [key, group] of Object.entries(
      Object.groupBy(entries, ([key, sexp]) => key),
    )) {
      if (group && group.length > 1) {
        const [_, firstSexp] = group[1]
        assert(firstSexp.meta)
        let message = `[parseExp] duplicated key in (interface)`
        message += `\n  key: ${key}`
        throw new S.ErrorWithMeta(message, firstSexp.meta)
      }
    }

    return L.Interface(
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* 'extend-interface head body)": ({ head, body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    for (const [key, group] of Object.entries(
      Object.groupBy(entries, ([key, sexp]) => key),
    )) {
      if (group && group.length > 1) {
        const [_, firstSexp] = group[1]
        assert(firstSexp.meta)
        let message = `[parseExp] duplicated key in (extend-interface)`
        message += `\n  key: ${key}`
        throw new S.ErrorWithMeta(message, firstSexp.meta)
      }
    }

    return L.ExtendInterface(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "`(the ,schema ,exp)": ({ schema, exp }, { meta }) => {
    return L.The(parseExp(schema), parseExp(exp), meta)
  },

  "`(polymorphic ,parameters ,type)": ({ parameters, type }, { meta }) => {
    return L.Polymorphic(
      S.listElements(parameters).map(S.symbolContent),
      parseExp(type),
      meta,
    )
  },

  "`(@require ,path ,name)": ({ path, name }, { meta }) => {
    return L.Require(S.stringContent(path), S.symbolContent(name), meta)
  },

  // - The following two cases must be at the end.

  "(cons* target args)": ({ target, args }, { meta }) => {
    return L.Apply(parseExp(target), S.listElements(args).map(parseExp), meta)
  },

  data: ({ data }, { meta }) => {
    switch (data.kind) {
      case "Keyword":
        return L.Keyword(S.keywordContent(data), meta)
      case "Int":
        return L.Int(S.intContent(data), meta)
      case "Float":
        return L.Float(S.floatContent(data), meta)
      case "String":
        return L.String(S.stringContent(data), meta)
      case "Symbol": {
        return L.Var(S.symbolContent(data), meta)
      }
    }
  },
})

const parseCondClause = S.createRouter<L.CondClause>({
  "(cons* question body)": ({ question, body }, { meta }) => {
    if (question.kind === "Symbol" && question.content === "else") {
      return L.CondClause(L.Bool(true, meta), parseBody(body), meta)
    } else {
      return L.CondClause(parseExp(question), parseBody(body), meta)
    }
  },
})

const parseMatchClause = S.createRouter<L.MatchClause>({
  "(cons* pattern body)": ({ pattern, body }, { meta }) =>
    L.MatchClause(
      [parseExp(pattern)],
      L.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    ),
})

const parseMatchManyClause = S.createRouter<L.MatchClause>({
  "(cons* patterns body)": ({ patterns, body }, { meta }) =>
    L.MatchClause(
      S.listElements(patterns).map(parseExp),
      L.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    ),
})
