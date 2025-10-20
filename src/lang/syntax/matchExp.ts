import * as X from "@xieyuheng/x-sexp.js"
import { arrayGroup2 } from "../../helpers/array/arrayGroup2.ts"
import { arrayPickLast } from "../../helpers/array/arrayPickLast.ts"
import { recordMapValue } from "../../helpers/record/recordMapValue.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import { sexpKeywordMeta } from "./sexpKeywordMeta.ts"

export function matchExp(sexp: X.Sexp): Exp {
  return X.match(expMatcher, sexp)
}

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher(
    "(cons* 'lambda parameters body)",
    ({ parameters, body }, { sexp }) => {
      const keyword = X.asTael(sexp).elements[0]
      const meta = X.tokenMetaFromSexpMeta(keyword.meta)

      if (X.isSymbol(parameters)) {
        return Exps.VariadicLambda(
          X.symbolContent(parameters),
          Exps.Begin(X.listElements(body).map(matchExp), meta),
          meta,
        )
      }

      if (X.listElements(parameters).length === 0) {
        return Exps.NullaryLambda(
          Exps.Begin(X.listElements(body).map(matchExp), meta),
          meta,
        )
      }

      return Exps.Lambda(
        X.listElements(parameters).map(matchExp),
        Exps.Begin(X.listElements(body).map(matchExp), meta),
        meta,
      )
    },
  ),

  X.matcher("`(@quote ,sexp)", ({ sexp }, { meta }) => {
    return Exps.Quote(sexp, meta)
  }),

  X.matcher("(cons* '@comment sexps)", ({ sexps }, { meta }) => {
    return Exps.Comment(X.listElements(sexps), meta)
  }),

  X.matcher("`(@quasiquote ,sexp)", ({ sexp }, { meta }) => {
    return Exps.Quasiquote(sexp, meta)
  }),

  X.matcher("`(@pattern ,pattern)", ({ pattern }, { meta }) => {
    return Exps.Pattern(matchExp(pattern), meta)
  }),

  X.matcher(
    "`(polymorphic ,parameters ,schema)",
    ({ parameters, schema }, { meta }) => {
      return Exps.Polymorphic(
        X.listElements(parameters).map(X.symbolContent),
        matchExp(schema),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'specific target args)", ({ target, args }, { meta }) => {
    return Exps.Specific(
      matchExp(target),
      X.listElements(args).map(matchExp),
      meta,
    )
  }),

  X.matcher(
    "`(if ,condition ,consequent ,alternative)",
    ({ condition, consequent, alternative }, { meta }) => {
      return Exps.If(
        matchExp(condition),
        matchExp(consequent),
        matchExp(alternative),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'when condition body)", ({ condition, body }, { meta }) => {
    return Exps.When(
      matchExp(condition),
      Exps.Begin(X.listElements(body).map(matchExp), meta),
      meta,
    )
  }),

  X.matcher(
    "(cons* 'unless condition body)",
    ({ condition, body }, { meta }) => {
      return Exps.Unless(
        matchExp(condition),
        Exps.Begin(X.listElements(body).map(matchExp), meta),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'and exps)", ({ exps }, { meta }) => {
    return Exps.And(X.listElements(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* 'or exps)", ({ exps }, { meta }) => {
    return Exps.Or(X.listElements(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* '-> exps)", ({ exps }, { meta }) => {
    const [argSchemas, retSchema] = arrayPickLast(
      X.listElements(exps).map(matchExp),
    )
    return Exps.Arrow(argSchemas, retSchema, meta)
  }),

  X.matcher(
    "`(*-> ,argSchema ,retSchema)",
    ({ argSchema, retSchema }, { meta }) => {
      return Exps.VariadicArrow(matchExp(argSchema), matchExp(retSchema), meta)
    },
  ),

  X.matcher("(cons* 'assert exps)", ({ exps }, { meta }) => {
    const args = X.listElements(exps).map(matchExp)
    if (args.length !== 1) {
      const message = "(assert) must take one argument\n"
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.Assert(args[0], meta)
  }),

  X.matcher("(cons* 'assert-not exps)", ({ exps }, { meta }) => {
    const args = X.listElements(exps).map(matchExp)
    if (args.length !== 1) {
      const message = "(assert-not) must take one argument\n"
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.AssertNot(args[0], meta)
  }),

  X.matcher("(cons* 'assert-equal exps)", ({ exps }, { meta }) => {
    const args = X.listElements(exps).map(matchExp)
    if (args.length !== 2) {
      const message = "(assert-equal) must take two arguments\n"
      throw new X.ErrorWithMeta(message, meta)
    }

    const [lhs, rhs] = args
    return Exps.AssertEqual(lhs, rhs, meta)
  }),

  X.matcher("(cons* 'assert-not-equal exps)", ({ exps }, { meta }) => {
    const args = X.listElements(exps).map(matchExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.AssertNotEqual(args[0], args[1], meta)
  }),

  X.matcher("(cons* 'assert-the exps)", ({ exps }, { meta }) => {
    const args = X.listElements(exps).map(matchExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.AssertThe(args[0], args[1], meta)
  }),

  X.matcher("`(= ,lhs ,rhs)", ({ lhs, rhs }, { meta }) => {
    return Exps.Assign(matchExp(lhs), matchExp(rhs), meta)
  }),

  X.matcher("`(the ,schema ,exp)", ({ schema, exp }, { meta }) => {
    return Exps.The(matchExp(schema), matchExp(exp), meta)
  }),

  X.matcher("(cons* '@tael elements)", ({ elements }, { sexp, meta }) => {
    return Exps.Tael(
      X.listElements(elements).map(matchExp),
      recordMapValue(X.asTael(sexp).attributes, matchExp),
      meta,
    )
  }),

  X.matcher("(cons* '@list elements)", ({ elements }, { sexp, meta }) => {
    if (Object.keys(X.asTael(sexp).attributes).length > 0) {
      let message = `(@list) literal list can not have attributes`
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.Tael(X.listElements(elements).map(matchExp), {}, meta)
  }),

  X.matcher("(cons* '@record elements)", ({ elements }, { sexp, meta }) => {
    if (X.listElements(elements).length > 0) {
      let message = `(@record) literal record can not have elements`
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.Tael(
      [],
      recordMapValue(X.asTael(sexp).attributes, matchExp),
      meta,
    )
  }),

  X.matcher("(cons* '@set elements)", ({ elements }, { sexp, meta }) => {
    if (Object.keys(X.asTael(sexp).attributes).length > 0) {
      let message = `(@set) can not have attributes`
      throw new X.ErrorWithMeta(message, meta)
    }

    return Exps.Set(X.listElements(elements).map(matchExp), meta)
  }),

  X.matcher("(cons* '@hash elements)", ({ elements }, { sexp, meta }) => {
    if (Object.keys(X.asTael(sexp).attributes).length > 0) {
      let message = `(@hash) can not have attributes`
      throw new X.ErrorWithMeta(message, meta)
    }

    if (X.listElements(elements).length % 2 === 1) {
      let message = `(@hash) body length must be even`
      throw new X.ErrorWithMeta(message, meta)
    }

    const entries = arrayGroup2(X.listElements(elements)).map(
      ([key, value]) => ({
        key: matchExp(key),
        value: matchExp(value),
      }),
    )
    return Exps.Hash(entries, meta)
  }),

  X.matcher("(cons* 'tau elements)", ({ elements }, { sexp, meta }) => {
    return Exps.Tau(
      X.listElements(elements).map(matchExp),
      recordMapValue(X.asTael(sexp).attributes, matchExp),
      meta,
    )
  }),

  X.matcher("(cons* 'begin body)", ({ body }, { meta }) => {
    return Exps.Begin(X.listElements(body).map(matchExp), meta)
  }),

  X.matcher("(cons* 'cond lines)", ({ lines }, { sexp }) => {
    const meta = sexpKeywordMeta(sexp)
    return Exps.Cond(X.listElements(lines).map(matchCondLine), meta)
  }),

  X.matcher("(cons* 'match target lines)", ({ target, lines }, { sexp }) => {
    const meta = sexpKeywordMeta(sexp)

    return Exps.Match(
      matchExp(target),
      X.listElements(lines).map(matchMatchLine),
      meta,
    )
  }),

  X.matcher("(cons* target args)", ({ target, args }, { meta }) => {
    return Exps.Apply(
      matchExp(target),
      X.listElements(args).map(matchExp),
      meta,
    )
  }),

  X.matcher("data", ({ data }, { meta }) => {
    switch (data.kind) {
      case "Hashtag":
        return Exps.Hashtag(X.hashtagContent(data), meta)
      case "Int":
        return Exps.Int(X.numberContent(data), meta)
      case "Float":
        return Exps.Float(X.numberContent(data), meta)
      case "String":
        return Exps.String(X.stringContent(data), meta)
      case "Symbol": {
        return Exps.Var(X.symbolContent(data), meta)
      }
    }
  }),
])

export function matchCondLine(sexp: X.Sexp): Exps.CondLine {
  return X.match(
    X.matcher("(cons* question body)", ({ question, body }, { meta }) => {
      if (question.kind === "Symbol" && question.content === "else") {
        return {
          question: Exps.Hashtag("t", meta),
          answer: Exps.Begin(X.listElements(body).map(matchExp), meta),
        }
      } else {
        return {
          question: matchExp(question),
          answer: Exps.Begin(X.listElements(body).map(matchExp), meta),
        }
      }
    }),
    sexp,
  )
}

export function matchMatchLine(sexp: X.Sexp): Exps.MatchLine {
  return X.match(
    X.matcher("(cons* pattern body)", ({ pattern, body }, { meta }) => {
      return {
        pattern: matchExp(pattern),
        body: Exps.Begin(X.listElements(body).map(matchExp), meta),
      }
    }),
    sexp,
  )
}
