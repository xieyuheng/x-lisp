import * as X from "@xieyuheng/x-data.js"
import { arrayPickLast } from "../../utils/array/arrayPickLast.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

export function matchExp(data: X.Data): Exp {
  return X.match(expMatcher, data)
}

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher(
    "(cons* 'lambda parameters body)",
    ({ parameters, body }, { meta }) => {
      if (X.dataToArray(parameters).length === 0) {
        let message = `(lambda) must have at least one parameter\n`
        throw new X.ParsingError(message, meta)
      }

      return Exps.Lambda(
        X.dataToArray(parameters).map(X.symbolToString),
        Exps.Begin(X.dataToArray(body).map(matchExp), meta),
        meta,
      )
    },
  ),

  X.matcher(
    "(cons* 'lambda-lazy parameters body)",
    ({ parameters, body }, { meta }) => {
      if (X.dataToArray(parameters).length === 0) {
        let message = `(lambda-lazy) must have at least one parameter\n`
        throw new X.ParsingError(message, meta)
      }

      return Exps.LambdaLazy(
        X.dataToArray(parameters).map(X.symbolToString),
        Exps.Begin(X.dataToArray(body).map(matchExp), meta),
        meta,
      )
    },
  ),

  X.matcher("(cons* 'thunk body)", ({ body }, { meta }) => {
    return Exps.Thunk(Exps.Begin(X.dataToArray(body).map(matchExp), meta), meta)
  }),

  X.matcher("`(lazy ,exp)", ({ exp }, { meta }) => {
    return Exps.Lazy(matchExp(exp), meta)
  }),

  X.matcher("`(quote ,sexp)", ({ sexp }, { meta }) => {
    return Exps.Quote(sexp, meta)
  }),

  X.matcher("`(quasiquote ,sexp)", ({ sexp }, { meta }) => {
    return Exps.Quasiquote(sexp, meta)
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

  X.matcher("(cons* 'and exps)", ({ exps }, { meta }) => {
    return Exps.And(X.dataToArray(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* 'or exps)", ({ exps }, { meta }) => {
    return Exps.Or(X.dataToArray(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* 'union exps)", ({ exps }, { meta }) => {
    return Exps.Union(X.dataToArray(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* 'inter exps)", ({ exps }, { meta }) => {
    return Exps.Inter(X.dataToArray(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* 'compose exps)", ({ exps }, { meta }) => {
    return Exps.Compose(X.dataToArray(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* 'pipe arg exps)", ({ arg, exps }, { meta }) => {
    return Exps.Pipe(matchExp(arg), X.dataToArray(exps).map(matchExp), meta)
  }),

  X.matcher("(cons* '-> exps)", ({ exps }, { meta }) => {
    const [args, ret] = arrayPickLast(X.dataToArray(exps).map(matchExp))
    return Exps.Arrow(args, ret, meta)
  }),

  X.matcher("(cons* 'assert exps)", ({ exps }, { meta }) => {
    const args = X.dataToArray(exps).map(matchExp)
    if (args.length !== 1) {
      const message = "(assert) must take one argument\n"
      throw new X.ParsingError(message, meta)
    }

    return Exps.Assert(args[0], meta)
  }),

  X.matcher("(cons* 'assert-not exps)", ({ exps }, { meta }) => {
    const args = X.dataToArray(exps).map(matchExp)
    if (args.length !== 1) {
      const message = "(assert-not) must take one argument\n"
      throw new X.ParsingError(message, meta)
    }

    return Exps.AssertNot(args[0], meta)
  }),

  X.matcher("(cons* 'assert-equal exps)", ({ exps }, { meta }) => {
    const args = X.dataToArray(exps).map(matchExp)
    if (args.length !== 2) {
      const message = "(assert-equal) must take two arguments\n"
      throw new X.ParsingError(message, meta)
    }

    const [lhs, rhs] = args
    return Exps.AssertEqual(lhs, rhs, meta)
  }),

  X.matcher("(cons* 'assert-not-equal exps)", ({ exps }, { meta }) => {
    const args = X.dataToArray(exps).map(matchExp)
    if (args.length !== 2) {
      const message = "(assert-not-equal) must take two arguments\n"
      throw new X.ParsingError(message, meta)
    }

    const [lhs, rhs] = args
    return Exps.AssertNotEqual(lhs, rhs, meta)
  }),

  X.matcher("`(= ,lhs ,rhs)", ({ lhs, rhs }, { meta }) => {
    return Exps.Assign(matchExp(lhs), matchExp(rhs), meta)
  }),

  X.matcher("(cons* 'tael elements)", ({ elements }, { data, meta }) => {
    return Exps.Tael(
      X.dataToArray(elements).map(matchExp),
      recordMap(X.asTael(data).attributes, matchExp),
      meta,
    )
  }),

  X.matcher("(cons* 'begin body)", ({ body }, { meta }) => {
    return Exps.Begin(X.dataToArray(body).map(matchExp), meta)
  }),

  X.matcher("(cons* 'cond lines)", ({ lines }, { meta }) => {
    return Exps.Cond(X.dataToArray(lines).map(matchCondLine), meta)
  }),

  X.matcher("(cons* 'match target lines)", ({ target, lines }, { meta }) => {
    return Exps.Match(
      matchExp(target),
      X.dataToArray(lines).map(matchMatchLine),
      meta,
    )
  }),

  X.matcher("[]", ({}, { data, meta }) => {
    const record = recordMap(X.asTael(data).attributes, matchExp)
    const entries = Object.entries(record)
    if (entries.length === 1) {
      const [name, target] = entries[0]
      return Exps.RecordGet(name, target, meta)
    } else if (entries.length === 0) {
      let message = `[matchExp] can not handle empty list\n`
      throw new X.ParsingError(message, meta)
    } else {
      let message = `[matchExp] can not handle record with multiple keys\n`
      throw new X.ParsingError(message, meta)
    }
  }),

  X.matcher("(cons* target args)", ({ target, args }, { meta }) => {
    return Exps.Apply(matchExp(target), X.dataToArray(args).map(matchExp), meta)
  }),

  X.matcher("data", ({ data }, { meta }) => {
    switch (data.kind) {
      case "Bool":
        return Exps.Bool(X.dataToBoolean(data), meta)
      case "Int":
        return Exps.Int(X.dataToNumber(data), meta)
      case "Float":
        return Exps.Float(X.dataToNumber(data), meta)
      case "String":
        return Exps.String(X.dataToString(data), meta)
      case "Symbol": {
        if (X.symbolToString(data).startsWith("#")) {
          if (X.symbolToString(data) === "#void") {
            return Exps.Void(meta)
          }

          if (X.symbolToString(data) === "#null") {
            return Exps.Null(meta)
          }

          let message = `unknown special symbol: ${X.symbolToString(data)}\n`
          throw new X.ParsingError(message, meta)
        }

        return Exps.Var(X.symbolToString(data), meta)
      }
    }
  }),
])

export function matchCondLine(data: X.Data): Exps.CondLine {
  return X.match(
    X.matcher("`(,question ,answer)", ({ question, answer }, { meta }) => {
      if (question.kind === "Symbol" && question.content === "else") {
        return {
          question: Exps.Bool(true, meta),
          answer: matchExp(answer),
        }
      }

      return {
        question: matchExp(question),
        answer: matchExp(answer),
      }
    }),
    data,
  )
}

export function matchMatchLine(data: X.Data): Exps.MatchLine {
  return X.match(
    X.matcher("(cons* pattern body)", ({ pattern, body }, { meta }) => {
      return {
        pattern: matchExp(pattern),
        body: Exps.Begin(X.dataToArray(body).map(matchExp), meta),
      }
    }),
    data,
  )
}
