import * as X from "@xieyuheng/x-data.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { matchExp } from "./matchExp.ts"

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "`(define ,(cons name args) ,exp)",
    ({ name, args, exp }, { span }) =>
      Stmts.Define(
        X.symbolToString(name),
        X.dataToArray(args)
          .map(X.symbolToString)
          .reduceRight((fn, name) => Exps.Lambda(name, fn), matchExp(exp)),
        { span },
      ),
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

  X.matcher("`(assert ,exp)", ({ exp }, { span }) =>
    Stmts.Assert(matchExp(exp), { span }),
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
