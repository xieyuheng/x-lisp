import * as X from "@xieyuheng/x-sexp.js"
import { Block } from "../block/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseInstr } from "./parseInstr.ts"

export function parseStmt(sexp: X.Sexp): Stmt {
  return X.match(stmtMatcher, sexp)
}

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher(
    "(cons* 'define-function name blocks)",
    ({ name, blocks }, { sexp }) => {
      const keyword = X.asTael(sexp).elements[1]
      const meta = X.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineFunction(
        X.symbolContent(name),
        new Map(
          X.listElements(blocks)
            .map(parseBlock)
            .map((block) => [block.label, block]),
        ),
        meta,
      )
    },
  ),
])

function parseBlock(sexp: X.Sexp): Block {
  return X.match(
    X.matcher("(cons* 'block label instrs)", ({ label, instrs }) => {
      const meta = X.tokenMetaFromSexpMeta(label.meta)
      return Block(
        X.symbolContent(label),
        X.listElements(instrs).map(parseInstr),
        meta,
      )
    }),
    sexp,
  )
}
