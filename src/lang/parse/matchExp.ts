import * as X from "@xieyuheng/x-data.js"
import * as Exps from "../exp/index.ts"
import { bindsFromArray, type Bind, type Exp } from "../exp/index.ts"
import * as Atoms from "../value/index.ts"

const expMatcher: X.Matcher<Exp> = X.matcherChoice<Exp>([
  X.matcher("`(lambda ,names ,exp)", ({ names, exp }) =>
    X.dataToArray(names)
      .map(X.symbolToString)
      .reduceRight((fn, name) => Exps.Lambda(name, fn), matchExp(exp)),
  ),

  X.matcher("`(let ,binds ,body)", ({ binds, body }) =>
    Exps.Let(
      bindsFromArray(X.dataToArray(binds).map(matchBind)),
      matchExp(body),
    ),
  ),

  X.matcher("(cons target args)", ({ target, args }) =>
    X.dataToArray(args)
      .map(matchExp)
      .reduce((result, arg) => Exps.Apply(result, arg), matchExp(target)),
  ),

  X.matcher("data", ({ data }) => {
    switch (data.kind) {
      case "Bool":
        return Atoms.Bool(X.dataToBoolean(data))
      case "Int":
        return Atoms.Int(X.dataToNumber(data))
      case "Float":
        return Atoms.Float(X.dataToNumber(data))
      case "String":
        return Atoms.String(X.dataToString(data))
      case "Symbol":
        return Exps.Var(X.symbolToString(data))
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
