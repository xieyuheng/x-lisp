import * as X from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseExp } from "./parseExp.ts"

export function parseStmt(sexp: X.Sexp): Stmt {
  return X.match(stmtMatcher, sexp)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) body)",
    ({ name, parameters, body }, { sexp }) => {
      const keyword = X.asTael(sexp).elements[1]
      const meta = X.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineFunction(
        X.symbolContent(name),
        X.listElements(parameters).map(X.symbolContent),
        Exps.BeginSugar(X.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  X.matcher("exp", ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  }),
])
