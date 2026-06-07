import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export function parseBody(body: S.Sexp): M.Exp {
  const elements = S.asListSexp(body).elements.map(parseExp)
  if (elements.length === 1) {
    return elements[0]
  } else {
    return M.BeginExp(elements, body.location)
  }
}

export const parseExp: S.Router<M.Exp> = S.createRouter<M.Exp>({
  "(cons* 'lambda parameters body)": ({ parameters, body }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.LambdaExp(
      S.asListSexp(parameters).elements.map((x) => S.asSymbolSexp(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "`(@quote ,sexp)": ({ sexp }, { location }) => {
    return M.QuoteExp(sexp, location)
  },

  "`(@sexp ,sexp)": ({ sexp }, { location }) => {
    return M.SexpExp(sexp, location)
  },

  "(cons* '@comment sexps)": ({ sexps }, { location }) => {
    return M.CommentExp(S.asListSexp(sexps).elements, location)
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
    return M.AndExp(S.asListSexp(exps).elements.map(parseExp), location)
  },

  "(cons* 'or exps)": ({ exps }, { location }) => {
    return M.OrExp(S.asListSexp(exps).elements.map(parseExp), location)
  },

  "(cons* 'cond clauses)": ({ clauses }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.CondExp(
      S.asListSexp(clauses).elements.map(parseCondClause),
      keyword.location,
    )
  },

  "(cons* 'match target clauses)": ({ target, clauses }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.MatchExp(
      [parseExp(target)],
      S.asListSexp(clauses).elements.map(parseMatchClause),
      keyword.location,
    )
  },

  "(cons* 'match-many targets clauses)": ({ targets, clauses }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.MatchExp(
      S.asListSexp(targets).elements.map(parseExp),
      S.asListSexp(clauses).elements.map(parseMatchManyClause),
      keyword.location,
    )
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { location }) => {
    return M.AssignExp(S.asSymbolSexp(name).content, parseExp(rhs), location)
  },

  "(cons* 'define (cons* name parameters) body)": (
    { name, parameters, body },
    { sexp },
  ) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.LocalDefineExp(
      S.asSymbolSexp(name).content,
      S.asListSexp(parameters).elements.map((x) => S.asSymbolSexp(x).content),
      parseBody(body),
      keyword.location,
    )
  },

  "(cons* 'define name body)": ({ name, body }, { sexp }) => {
    const keyword = S.asListSexp(sexp).elements[0]
    return M.LocalDefineExp(
      S.asSymbolSexp(name).content,
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
      S.asListSexp(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'let* bindings body)": ({ bindings, body }, { location }) => {
    return M.LetStarExp(
      S.asListSexp(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'letrec bindings body)": ({ bindings, body }, { location }) => {
    return M.LetrecExp(
      S.asListSexp(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* 'letrec* bindings body)": ({ bindings, body }, { location }) => {
    return M.LetrecStarExp(
      S.asListSexp(bindings).elements.map(parseBinding),
      parseBody(body),
      location,
    )
  },

  "(cons* '@square-bracket elements)": ({ elements }, { location }) => {
    return M.ListExp(S.asListSexp(elements).elements.map(parseExp), location)
  },

  "(cons* '@list elements)": ({ elements }, { location }) => {
    return M.ListExp(S.asListSexp(elements).elements.map(parseExp), location)
  },

  "(cons* '@string elements)": ({ elements }, { location }) => {
    return M.StringConcatExp(
      S.asListSexp(elements).elements.map(parseExp),
      location,
    )
  },

  "(cons* '@set elements)": ({ elements }, { location }) => {
    return M.SetExp(S.asListSexp(elements).elements.map(parseExp), location)
  },

  "(cons* '@hash elements)": ({ elements }, { location }) => {
    if (S.asListSexp(elements).elements.length % 2 === 1) {
      let message = `(@hash) body length must be even`
      throw new S.ErrorWithSourceLocation(message, location)
    }

    const entries = arrayGroup2(S.asListSexp(elements).elements).map(
      ([key, value]) => ({
        key: parseExp(key),
        value: parseExp(value),
      }),
    )
    return M.HashExp(entries, location)
  },

  "(cons* '-> exps)": ({ exps }, { location }) => {
    const [argTypes, retType] = arrayPickLast(
      S.asListSexp(exps).elements.map(parseExp),
    )
    return M.ArrowExp(argTypes, retType, location)
  },

  "`(the ,schema ,exp)": ({ schema, exp }, { location }) => {
    return M.TheExp(parseExp(schema), parseExp(exp), location)
  },

  "`(polymorphic ,parameters ,type)": ({ parameters, type }, { location }) => {
    return M.PolymorphicExp(
      S.asListSexp(parameters).elements.map((x) => S.asSymbolSexp(x).content),
      parseExp(type),
      location,
    )
  },

  "(cons* 'pipe target steps)": ({ target, steps }, { location }) => {
    return M.PipeExp(
      parseExp(target),
      S.asListSexp(steps).elements.map(parseExp),
      location,
    )
  },

  "(cons* 'chain steps)": ({ steps }, { location }) => {
    return M.ChainExp(S.asListSexp(steps).elements.map(parseExp), location)
  },

  "(cons* 'compose steps)": ({ steps }, { location }) => {
    return M.ComposeExp(S.asListSexp(steps).elements.map(parseExp), location)
  },

  // - The following two cases must be at the end.

  "(cons* target args)": ({ target, args }, { location }) => {
    return M.ApplyExp(
      parseExp(target),
      S.asListSexp(args).elements.map(parseExp),
      location,
    )
  },

  data: ({ data }, { location }) => {
    switch (data.kind) {
      case "KeywordSexp":
        return M.KeywordExp(S.asKeywordSexp(data).content, location)
      case "IntSexp":
        return M.IntExp(S.asIntSexp(data).content, location)
      case "FloatSexp":
        return M.FloatExp(S.asFloatSexp(data).content, location)
      case "StringSexp":
        return M.StringExp(S.asStringSexp(data).content, location)
      case "SymbolSexp": {
        const name = S.asSymbolSexp(data).content
        if (name.includes("/")) {
          const parts = name.split("/")
          if (parts.length === 3) {
            return M.QualifiedVarExp(parts[0], parts[1], parts[2], location)
          }

          if (parts.length !== 2) {
            let message = `qualified variable must have one or two /`
            throw new S.ErrorWithSourceLocation(message, location)
          }

          return M.QualifiedVarExp("self", parts[0], parts[1], location)
        } else {
          return M.VarExp(name, location)
        }
      }
    }
  },
})

const parseBinding = S.createRouter<M.Binding>({
  "`(,name ,rhs)": ({ name, rhs }, { location }) => {
    return M.Binding(S.asSymbolSexp(name).content, parseExp(rhs), location)
  },
})

const parseCondClause = S.createRouter<M.CondClause>({
  "(cons* question body)": ({ question, body }, { location }) => {
    if (question.kind === "SymbolSexp" && question.content === "else") {
      return M.CondClause(
        M.QualifiedVarExp("meta-builtin", "builtin", "true", location),
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
    M.MatchClause([parseExp(pattern)], parseBody(body), location),
})

const parseMatchManyClause = S.createRouter<M.MatchClause>({
  "(cons* patterns body)": ({ patterns, body }, { location }) =>
    M.MatchClause(
      S.asListSexp(patterns).elements.map(parseExp),
      parseBody(body),
      location,
    ),
})
