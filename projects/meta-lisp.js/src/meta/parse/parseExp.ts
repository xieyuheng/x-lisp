import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function parseBody(body: S.Sexp): M.Exp {
  const elements = S.asList(body).elements.map(parseExp)
  if (elements.length === 1) {
    return elements[0]
  } else {
    return M.BeginSugar(elements, body.location)
  }
}

export const parseExp: S.Router<M.Exp> = S.createRouter<M.Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.Lambda(
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "`(@quote ,sexp)": ({ sexp }, { location }) => {
    return M.Quote(sexp, location)
  },

  "`(if ,condition ,consequent ,alternative)": (
    { condition, consequent, alternative },
    { location },
  ) => {
    return M.If(
      parseExp(condition),
      parseExp(consequent),
      parseExp(alternative),
      location,
    )
  },

  "(cons* 'when condition body)": ({ condition, body }, { location }) => {
    return M.When(parseExp(condition), parseBody(body), location)
  },

  "(cons* 'unless condition body)": ({ condition, body }, { location }) => {
    return M.Unless(parseExp(condition), parseBody(body), location)
  },

  "(cons* 'and exps)": ({ exps }, { location }) => {
    return M.And(S.asList(exps).elements.map(parseExp), location)
  },

  "(cons* 'or exps)": ({ exps }, { location }) => {
    return M.Or(S.asList(exps).elements.map(parseExp), location)
  },

  "(cons* 'cond clauses)": ({ clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.Cond(
      S.asList(clauses).elements.map(parseCondClause),
      keyword.location,
    )
  },

  "(cons* 'match target clauses)": ({ target, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.Match(
      [parseExp(target)],
      S.asList(clauses).elements.map(parseMatchClause),
      keyword.location,
    )
  },

  "(cons* 'match-many targets clauses)": ({ targets, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.Match(
      S.asList(targets).elements.map(parseExp),
      S.asList(clauses).elements.map(parseMatchManyClause),
      keyword.location,
    )
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { location }) => {
    return M.AssignSugar(S.asSymbol(name).content, parseExp(rhs), location)
  },

  "(cons* 'begin body)": ({ body }, { location }) => {
    return parseBody(body)
  },

  "(cons* 'let bindings body)": ({ bindings, body }, { location }) => {
    return M.Let(
      S.asList(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'let* bindings body)": ({ bindings, body }, { location }) => {
    return M.LetStar(
      S.asList(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* '@list elements)": ({ elements }, { location }) => {
    return M.LiteralList(S.asList(elements).elements.map(parseExp), location)
  },

  "(cons* '@record body)": ({ body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.LiteralRecord(
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "(cons* '@set elements)": ({ elements }, { location }) => {
    return M.LiteralSet(S.asList(elements).elements.map(parseExp), location)
  },

  "(cons* '@hash elements)": ({ elements }, { location }) => {
    if (S.asList(elements).elements.length % 2 === 1) {
      let message = `(@hash) body length must be even`
      throw new S.ErrorWithSourceLocation(message, location)
    }

    const entries = arrayGroup2(S.asList(elements).elements).map(
      ([key, value]) => ({
        key: parseExp(key),
        value: parseExp(value),
      }),
    )
    return M.LiteralHash(entries, location)
  },

  "(cons* '-> exps)": ({ exps }, { location }) => {
    const [argTypes, retType] = arrayPickLast(
      S.asList(exps).elements.map(parseExp),
    )
    return M.Arrow(argTypes, retType, location)
  },

  "(cons* 'interface body)": ({ body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.Interface(
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "(cons* 'extend-interface head body)": ({ head, body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.ExtendInterface(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "(cons* 'extend head body)": ({ head, body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.Extend(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "(cons* 'update head body)": ({ head, body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.Update(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "(cons* 'update! head body)": ({ head, body }, { location }) => {
    const entries = S.collectKeyValuePairs(S.asList(body).elements)
    M.assertNoDuplicatedKey(entries)
    return M.UpdateMut(
      parseExp(head),
      recordMapValue(Object.fromEntries(entries), parseExp),
      location,
    )
  },

  "`(the ,schema ,exp)": ({ schema, exp }, { location }) => {
    return M.The(parseExp(schema), parseExp(exp), location)
  },

  "`(polymorphic ,parameters ,type)": ({ parameters, type }, { location }) => {
    return M.Polymorphic(
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseExp(type),
      location,
    )
  },

  // - The following two cases must be at the end.

  "(cons* target args)": ({ target, args }, { location }) => {
    return M.Apply(
      parseExp(target),
      S.asList(args).elements.map(parseExp),
      location,
    )
  },

  data: ({ data }, { location }) => {
    switch (data.kind) {
      case "Keyword":
        return M.Keyword(S.asKeyword(data).content, location)
      case "Int":
        return M.Int(S.asInt(data).content, location)
      case "Float":
        return M.Float(S.asFloat(data).content, location)
      case "String":
        return M.String(S.asString(data).content, location)
      case "Symbol": {
        const name = S.asSymbol(data).content
        if (name.includes("/")) {
          const parts = name.split("/")
          if (parts.length !== 2) {
            let message = `qualified variable must have only one /`
            throw new S.ErrorWithSourceLocation(message, location)
          }

          return M.QualifiedVar(parts[0], parts[1], location)
        } else {
          return M.Var(name, location)
        }
      }
    }
  },
})

const parseBinding = S.createRouter<M.Binding>({
  "`(,name ,rhs)": ({ name, rhs }, { location }) => {
    return M.Binding(S.asSymbol(name).content, parseExp(rhs), location)
  },
})

const parseCondClause = S.createRouter<M.CondClause>({
  "(cons* question body)": ({ question, body }, { location }) => {
    if (question.kind === "Symbol" && question.content === "else") {
      return M.CondClause(
        M.QualifiedVar("builtin", "true", location),
        parseBody(body),
        location,
      )
    } else {
      return M.CondClause(parseExp(question), parseBody(body), location)
    }
  },
})

const parseMatchClause = S.createRouter<M.MatchClause>({
  "(cons* pattern body)": ({ pattern, body }, { location }) =>
    M.MatchClause(
      [parseExp(pattern)],
      M.BeginSugar(S.asList(body).elements.map(parseExp), location),
      location,
    ),
})

const parseMatchManyClause = S.createRouter<M.MatchClause>({
  "(cons* patterns body)": ({ patterns, body }, { location }) =>
    M.MatchClause(
      S.asList(patterns).elements.map(parseExp),
      M.BeginSugar(S.asList(body).elements.map(parseExp), location),
      location,
    ),
})
