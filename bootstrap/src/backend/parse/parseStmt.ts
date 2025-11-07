import * as S from "@xieyuheng/x-sexp.js"
import { Block } from "../block/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseInstr } from "./parseInstr.ts"

export function parseStmt(sexp: S.Sexp): Stmt {
  return S.match(stmtMatcher, sexp)
}

const stmtMatcher: S.Matcher<Stmt> = S.matcherChoice<Stmt>([
  S.matcher(
    "(cons* 'define-function name blocks)",
    ({ name, blocks }, { sexp }) => {
      const keyword = S.asTael(sexp).elements[1]
      const meta = S.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineFunction(
        S.symbolContent(name),
        new Map(
          S.listElements(blocks)
            .map(parseBlock)
            .map((block) => [block.label, block]),
        ),
        meta,
      )
    },
  ),
])

function parseBlock(sexp: S.Sexp): Block {
  return S.match(
    S.matcher("(cons* 'block label instrs)", ({ label, instrs }) => {
      const meta = S.tokenMetaFromSexpMeta(label.meta)
      return Block(
        S.symbolContent(label),
        S.listElements(instrs).map(parseInstr),
        meta,
      )
    }),
    sexp,
  )
}
