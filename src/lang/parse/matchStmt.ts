import * as X from "@xieyuheng/x-data.js"
import * as Exps from "../exp/index.ts"
import { type Exp } from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import type { DataField } from "../value/Data.ts"
import { matchExp } from "./matchExp.ts"

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons name args) body)",
    ({ name, args, body }, { span }) => {
      let result: Exp = Exps.Begin(X.dataToArray(body).map(matchExp), { span })
      for (const argName of X.dataToArray(args).map(X.symbolToString)) {
        result = Exps.Lambda(argName, result, { span })
      }

      return Stmts.Define(X.symbolToString(name), result, { span })
    },
  ),

  X.matcher("`(define ,name ,exp)", ({ name, exp }, { span }) =>
    Stmts.Define(X.symbolToString(name), matchExp(exp), { span }),
  ),

  X.matcher("(cons 'import body)", ({ body }, { span }) => {
    const array = X.dataToArray(body)
    const url = array[array.length - 1]
    const entries = array.slice(0, array.length - 1)
    return Stmts.Import(X.dataToString(url), entries.map(matchImportEntry), {
      span,
    })
  }),

  X.matcher(
    "(cons* 'define-data predicate constructors)",
    ({ predicate, constructors }, { span }) =>
      Stmts.DefineData(
        matchDataPredicate(predicate),
        X.dataToArray(constructors).map(matchDataConstructor),
        { span },
      ),
  ),

  X.matcher("exp", ({ exp }, { span }) =>
    Stmts.Compute(matchExp(exp), { span }),
  ),
])

export function matchStmt(data: X.Data): Stmt {
  return X.match(stmtMatcher, data)
}

function matchImportEntry(data: X.Data): Stmts.ImportEntry {
  return X.match(
    X.matcherChoice([
      X.matcher("`(rename ,name ,rename)", ({ name, rename }, { span }) => ({
        name: X.symbolToString(name),
        rename: X.symbolToString(rename),
        meta: { span },
      })),

      X.matcher("name", ({ name }, { span }) => ({
        name: X.symbolToString(name),
        meta: { span },
      })),
    ]),
    data,
  )
}

function matchDataPredicate(data: X.Data): Stmts.DataPredicateSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons name parameters)", ({ name, parameters }, { span }) => ({
        name: X.symbolToString(name),
        parameters: X.dataToArray(parameters).map(X.symbolToString),
      })),

      X.matcher("name", ({ name }, { span }) => ({
        name: X.symbolToString(name),
        parameters: [],
      })),
    ]),
    data,
  )
}

function matchDataConstructor(data: X.Data): Stmts.DataConstructorSpec {
  return X.match(
    X.matcherChoice([
      X.matcher("(cons name fields)", ({ name, fields }, { span }) => ({
        name: X.symbolToString(name),
        fields: X.dataToArray(fields).map(matchDataField),
      })),

      X.matcher("name", ({ name }, { span }) => ({
        name: X.symbolToString(name),
        fields: [],
      })),
    ]),
    data,
  )
}

function matchDataField(data: X.Data): DataField {
  return X.match(
    X.matcherChoice([
      X.matcher("`(,name ,exp)", ({ name, exp }, { span }) => ({
        name: X.symbolToString(name),
        predicate: matchExp(exp),
      })),
    ]),
    data,
  )
}
