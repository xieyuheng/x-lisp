import * as X from "@xieyuheng/x-sexp.js"
import { type Block } from "../block/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function matchStmt(data: X.Sexp): Stmt {
  return X.match(stmtMatcher, data)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) blocks)",
    ({ name, parameters, body }, { sexp }) => {
      const blocks: Map<string, Block> = new Map()
      return Stmts.DefineFunction(
        X.symbolContent(name),
        X.listElements(parameters).map(X.symbolContent),
        blocks,
      )
    },
  ),
])
