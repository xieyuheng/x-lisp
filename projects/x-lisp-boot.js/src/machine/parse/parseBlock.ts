import * as S from "@xieyuheng/sexp.js"
import { Block } from "../block/index.ts"
import { parseInstr } from "./parseInstr.ts"

export function parseBlock(sexp: S.Sexp): Block {
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
