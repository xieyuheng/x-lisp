import * as X from "@xieyuheng/x-data.js"
import { recordMap } from "../../utils/record/recordMap.ts"
import * as Exps from "../exp/index.ts"
import { bindsFromArray, type Bind, type Exp } from "../exp/index.ts"

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher("`(lambda ,names ,exp)", ({ names, exp }, { span }) =>
    X.dataToArray(names)
      .map(X.symbolToString)
      .reduceRight(
        (fn, name) => Exps.Lambda(name, fn, { span }),
        matchExp(exp),
      ),
  ),

  X.matcher("`(let ,binds ,body)", ({ binds, body }, { span }) =>
    Exps.Let(
      bindsFromArray(X.dataToArray(binds).map(matchBind)),
      matchExp(body),
      { span },
    ),
  ),

  X.matcher("`(quote ,data)", ({ data }, { span }) =>
    Exps.Quote(data, { span }),
  ),

  X.matcher("`(= ,name ,rhs)", ({ name, rhs }, { span }) =>
    Exps.Assign(X.symbolToString(name), matchExp(rhs), { span }),
  ),

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

  X.matcher("(cons target args)", ({ target, args }, { span }) => {
    return X.dataToArray(args)
      .map(matchExp)
      .reduce(
        (result, arg) => Exps.Apply(result, arg, { span }),
        matchExp(target),
      )
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
      case "Symbol":
        return Exps.Var(X.symbolToString(data), { span })
    }
  }),
])

export function matchExp(data: X.Data): Exp {
  return X.match(expMatcher, data)
}

export function matchBind(data: X.Data): Bind {
  return X.match(
    X.matcher("`(,name ,exp)", ({ name, exp }) => ({
      name: X.symbolToString(name),
      exp: matchExp(exp),
    })),
    data,
  )
}
