import * as X from "@xieyuheng/x-sexp.js"
import { Block } from "../block/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { matchInstr } from "./matchInstr.ts"

export function matchStmt(sexp: X.Sexp): Stmt {
  return X.match(stmtMatcher, sexp)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define-function (cons* name parameters) blocks)",
    ({ name, parameters, blocks }, { sexp }) => {
      return Stmts.DefineFunction(
        X.symbolContent(name),
        X.listElements(parameters).map(X.symbolContent),
        new Map(
          X.listElements(blocks)
            .map(matchBlock)
            .map((block) => [block.label, block]),
        ),
      )
    },
  ),
])

function matchBlock(sexp: X.Sexp): Block {
  return X.match(
    X.matcher("(cons* 'block label instrs)", ({ label, instrs }) => {
      const meta = X.tokenMetaFromSexpMeta(label.meta)
      return Block(
        X.symbolContent(label),
        X.listElements(instrs).map(matchInstr),
        meta,
      )
    }),
    sexp,
  )
}
