import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function parseBody(body: S.Sexp): M.Exp {
  const elements = S.asList(body).elements.map(parseExp)
  if (elements.length === 1) {
    return elements[0]
  } else {
    return M.BeginExp(elements, body.location)
  }
}

export const parseExp: S.Router<M.Exp> = S.createRouter<M.Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.LambdaExp(
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "`(@quote ,sexp)": ({ sexp }, { location }) => {
    return M.QuoteExp(sexp, location)
  },

  "`(if ,condition ,consequent ,alternative)": (
    { condition, consequent, alternative },
    { location },
  ) => {
    return M.IfExp(
      parseExp(condition),
      parseExp(consequent),
      parseExp(alternative),
      location,
    )
  },

  "(cons* 'when condition body)": ({ condition, body }, { location }) => {
    return M.WhenExp(parseExp(condition), parseBody(body), location)
  },

  "(cons* 'unless condition body)": ({ condition, body }, { location }) => {
    return M.UnlessExp(parseExp(condition), parseBody(body), location)
  },

  "(cons* 'and exps)": ({ exps }, { location }) => {
    return M.AndExp(S.asList(exps).elements.map(parseExp), location)
  },

  "(cons* 'or exps)": ({ exps }, { location }) => {
    return M.OrExp(S.asList(exps).elements.map(parseExp), location)
  },

  "(cons* 'cond clauses)": ({ clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.CondExp(
      S.asList(clauses).elements.map(parseCondClause),
      keyword.location,
    )
  },

  "(cons* 'match target clauses)": ({ target, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.MatchExp(
      [parseExp(target)],
      S.asList(clauses).elements.map(parseMatchClause),
      keyword.location,
    )
  },

  "(cons* 'match-many targets clauses)": ({ targets, clauses }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.MatchExp(
      S.asList(targets).elements.map(parseExp),
      S.asList(clauses).elements.map(parseMatchManyClause),
      keyword.location,
    )
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { location }) => {
    return M.AssignExp(S.asSymbol(name).content, parseExp(rhs), location)
  },

  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asList(sexp).elements[0]
    return M.LocalDefineExp(
      S.asSymbol(name).content,
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asList(sexp).elements[0]
    return M.LocalDefineExp(
      S.asSymbol(name).content,
      [],
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'begin body)": ({ body }, { location }) => {
    return parseBody(body)
  },

  "(cons* 'let bindings body)": ({ bindings, body }, { location }) => {
    return M.LetExp(
      S.asList(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'let* bindings body)": ({ bindings, body }, { location }) => {
    return M.LetStarExp(
      S.asList(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'letrec bindings body)": ({ bindings, body }, { location }) => {
    return M.LetrecExp(
      S.asList(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'letrec* bindings body)": ({ bindings, body }, { location }) => {
    return M.LetrecStarExp(
      S.asList(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* '@square-bracket elements)": ({ elements }, { location }) => {
    return M.LiteralListExp(S.asList(elements).elements.map(parseExp), location)
  },

  "(cons* '@list elements)": ({ elements }, { location }) => {
    return M.LiteralListExp(S.asList(elements).elements.map(parseExp), location)
  },

  "(cons* '@set elements)": ({ elements }, { location }) => {
    return M.LiteralSetExp(S.asList(elements).elements.map(parseExp), location)
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
    return M.LiteralHashExp(entries, location)
  },

  "(cons* '-> exps)": ({ exps }, { location }) => {
    const [argTypes, retType] = arrayPickLast(
      S.asList(exps).elements.map(parseExp),
    )
    return M.ArrowExp(argTypes, retType, location)
  },

  "`(the ,schema ,exp)": ({ schema, exp }, { location }) => {
    return M.TheExp(parseExp(schema), parseExp(exp), location)
  },

  "`(polymorphic ,parameters ,type)": ({ parameters, type }, { location }) => {
    return M.PolymorphicExp(
      S.asList(parameters).elements.map((x) => S.asSymbol(x).content),
      parseExp(type),
      location,
    )
  },

  "(cons* 'pipe target steps)": ({ target, steps }, { location }) => {
    return M.PipeExp(
      parseExp(target),
      S.asList(steps).elements.map(parseExp),
      location,
    )
  },

  "(cons* 'chain steps)": ({ steps }, { location }) => {
    return M.ChainExp(S.asList(steps).elements.map(parseExp), location)
  },

  "(cons* 'compose steps)": ({ steps }, { location }) => {
    return M.ComposeExp(S.asList(steps).elements.map(parseExp), location)
  },

  // - The following two cases must be at the end.

  "(cons* target args)": ({ target, args }, { location }) => {
    return M.ApplyExp(
      parseExp(target),
      S.asList(args).elements.map(parseExp),
      location,
    )
  },

  data: ({ data }, { location }) => {
    switch (data.kind) {
      case "Keyword":
        return M.KeywordExp(S.asKeyword(data).content, location)
      case "Int":
        return M.IntExp(S.asInt(data).content, location)
      case "Float":
        return M.FloatExp(S.asFloat(data).content, location)
      case "String":
        return M.StringExp(S.asString(data).content, location)
      case "Symbol": {
        const name = S.asSymbol(data).content
        if (name.includes("/")) {
          const parts = name.split("/")
          if (parts.length !== 2) {
            let message = `qualified variable must have only one /`
            throw new S.ErrorWithSourceLocation(message, location)
          }

          return M.QualifiedVarExp(parts[0], parts[1], location)
        } else {
          return M.VarExp(name, location)
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
        M.QualifiedVarExp("builtin", "true", location),
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
      M.BeginExp(S.asList(body).elements.map(parseExp), location),
      location,
    ),
})

const parseMatchManyClause = S.createRouter<M.MatchClause>({
  "(cons* patterns body)": ({ patterns, body }, { location }) =>
    M.MatchClause(
      S.asList(patterns).elements.map(parseExp),
      M.BeginExp(S.asList(body).elements.map(parseExp), location),
      location,
    ),
})
