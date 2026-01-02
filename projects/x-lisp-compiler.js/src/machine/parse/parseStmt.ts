import * as S from "@xieyuheng/sexp.js"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { parseBlock } from "./parseBlock.ts"
import { parseDirective } from "./parseDirective.ts"

export const parseStmt = S.createRouter<Stmt>({
  "(cons* 'export names)": ({ names }, { meta }) => {
    return Stmts.Export(S.listElements(names).map(S.symbolContent), meta)
  },

  "(cons* 'define-code name blocks)": ({ name, blocks }, { sexp }) => {
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

  "(cons* 'define-data name directives)": ({ name, directives }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Stmts.DefineData(
      S.symbolContent(name),
      S.listElements(directives).map(parseDirective),
      meta,
    )
  },

  "`(define-space ,name ,size)": ({ name, size }, { sexp }) => {
    const keyword = S.asTael(sexp).elements[1]
    const meta = S.tokenMetaFromSexpMeta(keyword.meta)
    return Stmts.DefineSpace(
      S.symbolContent(name),
      Number(S.intContent(size)),
      meta,
    )
  },
})
