import * as X from "@xieyuheng/x-data.js"
import { arrayPickLast } from "../../utils/array/arrayPickLast.ts"
import { recordMap } from "../../utils/record/recordMap.ts"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher(
    "(cons* 'lambda parameters body)",
    ({ parameters, body }, { span }) => {
      if (X.dataToArray(parameters).length === 0) {
        let message = `(lambda) expression must have at least one parameter\n`
        throw new X.ParsingError(message, span)
      }

      return Exps.Lambda(
        X.dataToArray(parameters).map(X.symbolToString),
        Exps.Begin(X.dataToArray(body).map(matchExp), { span }),
        { span },
      )
    },
  ),

  X.matcher("(cons* 'thunk body)", ({ body }, { span }) => {
    return Exps.Thunk(Exps.Begin(X.dataToArray(body).map(matchExp), { span }), {
      span,
    })
  }),

  X.matcher("`(quote ,data)", ({ data }, { span }) => {
    return Exps.Quote(data, { span })
  }),

  X.matcher(
    "`(if ,condition ,consequent ,alternative)",
    ({ condition, consequent, alternative }, { span }) => {
      return Exps.If(
        matchExp(condition),
        matchExp(consequent),
        matchExp(alternative),
        { span },
      )
    },
  ),

  X.matcher("(cons 'and exps)", ({ exps }, { span }) => {
    return Exps.And(X.dataToArray(exps).map(matchExp), { span })
  }),

  X.matcher("(cons 'or exps)", ({ exps }, { span }) => {
    return Exps.Or(X.dataToArray(exps).map(matchExp), { span })
  }),

  X.matcher("(cons 'union exps)", ({ exps }, { span }) => {
    return Exps.Union(X.dataToArray(exps).map(matchExp), { span })
  }),

  X.matcher("(cons 'inter exps)", ({ exps }, { span }) => {
    return Exps.Inter(X.dataToArray(exps).map(matchExp), { span })
  }),

  X.matcher("(cons '-> exps)", ({ exps }, { span }) => {
    const [args, ret] = arrayPickLast(X.dataToArray(exps).map(matchExp))
    return Exps.Arrow(args, ret, { span })
  }),

  X.matcher("(cons 'assert exps)", ({ exps }, { span }) => {
    const args = X.dataToArray(exps).map(matchExp)
    if (args.length !== 1) {
      const message = "(assert) expression can only take one arguments\n"
      throw new X.ParsingError(message, span)
    }

    return Exps.Assert(args[0], { span })
  }),

  X.matcher("`(= ,name ,rhs)", ({ name, rhs }, { span }) => {
    return Exps.Assign(X.symbolToString(name), matchExp(rhs), { span })
  }),

  X.matcher("(cons 'tael elements)", ({ elements }, { data, span }) => {
    return Exps.Tael(
      X.dataToArray(elements).map(matchExp),
      recordMap(X.asTael(data).attributes, matchExp),
      { span },
    )
  }),

  X.matcher("(cons 'begin body)", ({ body }, { span }) => {
    return Exps.Begin(X.dataToArray(body).map(matchExp), { span })
  }),

  X.matcher("(cons 'cond lines)", ({ lines }, { span }) => {
    return Exps.Cond(X.dataToArray(lines).map(matchCondLine), { span })
  }),

  X.matcher("(cons* 'match target lines)", ({ target, lines }, { span }) => {
    return Exps.Match(
      matchExp(target),
      X.dataToArray(lines).map(matchMatchLine),
      {
        span,
      },
    )
  }),

  X.matcher("(cons target args)", ({ target, args }, { span }) => {
    return Exps.Apply(matchExp(target), X.dataToArray(args).map(matchExp), {
      span,
    })
  }),

  X.matcher("data", ({ data }, { span }) => {
    switch (data.kind) {
      case "Bool":
        return Exps.Bool(X.dataToBoolean(data), { span })
      case "Int":
        return Exps.Int(X.dataToNumber(data), { span })
      case "Float":
        return Exps.Float(X.dataToNumber(data), { span })
      case "String":
        return Exps.String(X.dataToString(data), { span })
      case "Symbol": {
        if (X.symbolToString(data).startsWith("#")) {
          if (X.symbolToString(data) === "#void") {
            return Exps.Void({ span })
          }

          if (X.symbolToString(data) === "#null") {
            return Exps.Null({ span })
          }

          let message = `unknown special symbol: ${X.symbolToString(data)}\n`
          throw new X.ParsingError(message, span)
        }

        return Exps.Var(X.symbolToString(data), { span })
      }
    }
  }),
])

export function matchExp(data: X.Data): Exp {
  return X.match(expMatcher, data)
}

export function matchCondLine(data: X.Data): Exps.CondLine {
  return X.match(
    X.matcher("`(,question ,answer)", ({ question, answer }, { span }) => {
      if (question.kind === "Symbol" && question.content === "else") {
        return {
          question: Exps.Bool(true, { span }),
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
    X.matcher("(cons pattern body)", ({ pattern, body }, { span }) => {
      return {
        pattern: matchExp(pattern),
        body: Exps.Begin(X.dataToArray(body).map(matchExp), { span }),
      }
    }),
    data,
  )
}
