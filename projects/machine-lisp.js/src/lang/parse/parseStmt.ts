import * as S from "@xieyuheng/sexp.js"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseBlock } from "./parseBlock.ts"
import { parseChunk } from "./parseChunk.ts"

export function parseStmt(sexp: S.Sexp): Stmt {
  return S.match(stmtMatcher, sexp)
}

const stmtMatcher: S.Matcher<Stmt> = S.matcherChoice<Stmt>([
  S.matcher("(cons* 'export names)", ({ names }, { meta }) => {
    return Stmts.Export(S.listElements(names).map(S.symbolContent), meta)
  }),

  S.matcher(
    "(cons* 'define-code name blocks)",
    ({ name, blocks }, { sexp }) => {
      const keyword = S.asTael(sexp).elements[1]
      const meta = S.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineCode(
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

  S.matcher(
    "(cons* 'define-data name chunks)",
    ({ name, chunks }, { sexp }) => {
      const keyword = S.asTael(sexp).elements[1]
      const meta = S.tokenMetaFromSexpMeta(keyword.meta)
      return Stmts.DefineData(
        S.symbolContent(name),
        new Map(
          S.listElements(chunks)
            .map(parseChunk)
            .map((chunk) => [chunk.label, chunk]),
        ),
        meta,
      )
    },
  ),

  S.matcher("(cons* 'define-space name size)", ({ name, size }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Stmts.DefineSpace(S.symbolContent(name), S.numberContent(size), meta)
  }),
])
