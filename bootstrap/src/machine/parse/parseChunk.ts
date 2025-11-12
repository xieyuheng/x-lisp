import * as S from "@xieyuheng/x-sexp.js"
import { Chunk } from "../chunk/index.ts"
import { parseDirective } from "./parseDirective.ts"

export function parseChunk(sexp: S.Sexp): Chunk {
  return S.match(
    S.matcher("(cons* 'chunk label directives)", ({ label, directives }) => {
      const meta = S.tokenMetaFromSexpMeta(label.meta)
      return Chunk(
        S.symbolContent(label),
        S.listElements(directives).map(parseDirective),
        meta,
      )
    }),
    sexp,
  )
}
