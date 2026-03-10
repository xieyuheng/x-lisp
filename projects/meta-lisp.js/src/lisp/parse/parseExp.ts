import { arrayGroup2, arrayPickLast } from "@xieyuheng/helpers.js/array"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import * as S from "@xieyuheng/sexp.js"
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

  "(cons* 'cond lines)": ({ lines }, { sexp }) => {
    const keyword = S.asList(sexp).elements[1]
    return L.Cond(S.listElements(lines).map(parseCondLine), keyword.meta)
  },

  "`(= ,name ,rhs)": ({ name, rhs }, { meta }) => {
    return L.AssignSugar(S.symbolContent(name), parseExp(rhs), meta)
  },

  "(cons* 'begin body)": ({ body }, { meta }) => {
    return parseBody(body)
  },

  "(cons* '@list elements)": ({ elements }, { meta }) => {
    return L.List(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@tuple elements)": ({ elements }, { meta }) => {
    return L.Tuple(S.listElements(elements).map(parseExp), meta)
  },

  "(cons* '@object body)": ({ body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    return L.Object(recordMapValue(Object.fromEntries(entries), parseExp), meta)
  },

  "(cons* '@set elements)": ({ elements }, { meta }) => {
    return L.Set(S.listElements(elements).map(parseExp), meta)
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
    return L.Hash(entries, meta)
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

  "(cons* '@class body)": ({ body }, { meta }) => {
    const entries = S.listCollectKeywordEntries(body)
    return L.Class(recordMapValue(Object.fromEntries(entries), parseExp), meta)
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

const parseCondLine = S.createRouter<L.CondLine>({
  "(cons* question body)": ({ question, body }, { meta }) => {
    if (question.kind === "Symbol" && question.content === "else") {
      return {
        question: L.Bool(true, meta),
        answer: parseBody(body),
      }
    } else {
      return {
        question: parseExp(question),
        answer: parseBody(body),
      }
    }
  },
})
