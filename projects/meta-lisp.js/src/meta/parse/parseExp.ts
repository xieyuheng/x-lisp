import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function parseBody(body: S.Sexp): M.Exp {
  const elements = S.listElements(body).map(parseExp)
  if (elements.length === 1) {
    return elements[0]
  } else {
    return M.BeginSugar(elements, body.meta)
  }
}

export const parseExp: S.Router<M.Exp> = S.createRouter<M.Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return M.Lambda(
      S.listElements(parameters).map(S.symbolContent),
      parseBody(body),
      meta,
    )
  },

  "`(@quote ,sexp)": ({ sexp }, { meta }) => {
    return M.Quote(sexp, meta)
  },

  "`(if ,condition ,consequent ,alternative)": (
    { condition, consequent, alternative },
    { meta },
  ) => {
    return M.If(
      parseExp(condition),
      parseExp(consequent),
      parseExp(alternative),
      meta,
    )
  },

  "(cons* 'when condition body)": ({ condition, body }, { meta }) => {
    return M.When(parseExp(condition), parseBody(body), meta)
  },

  "(cons* 'unless condition body)": ({ condition, body }, { meta }) => {
    return M.Unless(parseExp(condition), parseBody(body), meta)
  },

  "(cons* 'and exps)": ({ exps }, { meta }) => {
    return M.And(S.listElements(exps).map(parseExp), meta)
  },

  "(cons* 'or exps)": ({ exps }, { meta }) => {
    return M.Or(S.listElements(exps).map(parseExp), meta)
  },

  "(cons* 'cond clauses)": ({ clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.Cond(S.listElements(clauses).map(parseCondClause), keyword.meta)
  },

  "(cons* 'match target clauses)": ({ target, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return M.Match(
      [parseExp(target)],
      S.listElements(clauses).map(parseMatchClause),
      meta,
    )
  },

  "(cons* 'match-many targets clauses)": ({ targets, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    const meta = keyword.meta
    return M.Match(
      S.listElements(targets).map(parseExp),
      S.listElements(clauses).map(parseMatchManyClause),
      meta,
    )
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { meta }) => {
    return M.AssignSugar(S.symbolContent(name), parseExp(rhs), meta)
  },

  "(cons* 'begin body)": ({ body }, { meta }) => {
    return parseBody(body)
  },

  "(cons* '@list elements)": ({ elements }, { meta }) => {
    return M.LiteralList(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@tuple elements)": ({ elements }, { meta }) => {
    return M.LiteralTuple(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@record body)": ({ body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.LiteralRecord(
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* '@set elements)": ({ elements }, { meta }) => {
    return M.LiteralSet(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@hash elements)": ({ elements }, { meta }) => {
    if (S.listElements(elements).length % 2 === 1) {
      let message = `(@hash) body length must be even`
      throw new S.ErrorWithSourceLocation(message, meta)
    }

    const entries = arrayGroup2(S.listElements(elements)).map(
      ([key, value]) => ({
        key: parseExp(key),
        value: parseExp(value),
      }),
    )
    return M.LiteralHash(entries, meta)
  },

  "(cons* '-> exps)": ({ exps }, { meta }) => {
    const [argTypes, retType] = arrayPickLast(
      S.listElements(exps).map(parseExp),
    )
    return M.Arrow(argTypes, retType, meta)
  },

  "(cons* 'tau elements)": ({ elements }, { meta }) => {
    return M.Tau(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* 'interface body)": ({ body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.Interface(
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* 'extend-interface head body)": ({ head, body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.ExtendInterface(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* 'extend head body)": ({ head, body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.Extend(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* 'update head body)": ({ head, body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.Update(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "(cons* 'update! head body)": ({ head, body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    M.assertNoDuplicatedKey(entries)
    return M.UpdateMut(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      meta,
    )
  },

  "`(the ,schema ,exp)": ({ schema, exp }, { meta }) => {
    return M.The(parseExp(schema), parseExp(exp), meta)
  },

  "`(polymorphic ,parameters ,type)": ({ parameters, type }, { meta }) => {
    return M.Polymorphic(
      S.listElements(parameters).map(S.symbolContent),
      parseExp(type),
      meta,
    )
  },

  "`(@require ,path ,name)": ({ path, name }, { meta }) => {
    return M.Require(S.stringContent(path), S.symbolContent(name), meta)
  },

  // - The following two cases must be at the end.

  "(cons* target args)": ({ target, args }, { meta }) => {
    return M.Apply(parseExp(target), S.listElements(args).map(parseExp), meta)
  },

  data: ({ data }, { meta }) => {
    switch (data.kind) {
      case "Keyword":
        return M.Keyword(S.keywordContent(data), meta)
      case "Int":
        return M.Int(S.intContent(data), meta)
      case "Float":
        return M.Float(S.floatContent(data), meta)
      case "String":
        return M.String(S.stringContent(data), meta)
      case "Symbol": {
        return M.Var(S.symbolContent(data), meta)
      }
    }
  },
})

const parseCondClause = S.createRouter<M.CondClause>({
  "(cons* question body)": ({ question, body }, { meta }) => {
    if (question.kind === "Symbol" && question.content === "else") {
      return M.CondClause(M.Bool(true, meta), parseBody(body), meta)
    } else {
      return M.CondClause(parseExp(question), parseBody(body), meta)
    }
  },
})

const parseMatchClause = S.createRouter<M.MatchClause>({
  "(cons* pattern body)": ({ pattern, body }, { meta }) =>
    M.MatchClause(
      [parseExp(pattern)],
      M.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    ),
})

const parseMatchManyClause = S.createRouter<M.MatchClause>({
  "(cons* patterns body)": ({ patterns, body }, { meta }) =>
    M.MatchClause(
      S.listElements(patterns).map(parseExp),
      M.BeginSugar(S.listElements(body).map(parseExp), meta),
      meta,
    ),
})
