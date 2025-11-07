import * as S from "@xieyuheng/x-sexp.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseExp } from "./parseExp.ts"

export function parseStmt(sexp: S.Sexp): Stmt {
  return S.match(stmtMatcher, sexp)
}

const stmtMatcher: S.Matcher<Stmt> = S.matcherChoice<Stmt>([
  S.matcher(
    "(cons* 'define (cons* name parameters) body)",
    ({ name, parameters, body }, { sexp }) => {
      const keyword = S.asTael(sexp).elements[1]
      const meta = S.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineFunction(
        S.symbolContent(name),
        S.listElements(parameters).map(S.symbolContent),
        Exps.BeginSugar(S.listElements(body).map(parseExp), meta),
        meta,
      )
    },
  ),

  S.matcher("exp", ({ exp }, { meta }) => {
    return Stmts.Compute(parseExp(exp), meta)
  }),
])
