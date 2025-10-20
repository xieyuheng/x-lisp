import * as X from "@xieyuheng/x-sexp.js"
import { Block } from "../block/index.ts"
import type { Instr } from "../instr/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"

export function matchStmt(sexp: X.Sexp): Stmt {
  return X.match(stmtMatcher, sexp)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define (cons* name parameters) blocks)",
    ({ name, parameters, body }, { sexp }) => {
      return Stmts.DefineFunction(
        X.symbolContent(name),
        X.listElements(parameters).map(X.symbolContent),
        new Map(
          X.listElements(body)
            .map(matchBlock)
            .map((block) => [block.label, block]),
        ),
      )
    },
  ),
])

function matchBlock(sexp: X.Sexp): Block {
  return X.match(
    X.matcher("(cons* 'block label body)", ({ label, body }, { sexp }) => {
      const instrs: Array<Instr> = []
      return Block(X.symbolContent(label), instrs)
    }),
    sexp,
  )
}
