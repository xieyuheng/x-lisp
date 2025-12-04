import * as S from "@xieyuheng/sexp.js"
import { Block } from "../block/index.ts"
import { parseInstr } from "./parseInstr.ts"

export const parseBlock = S.createRouter<Block>({
  "(cons* 'block label instrs)": ({ label, instrs }) => {
    const meta = S.tokenMetaFromSexpMeta(label.meta)
    return Block(
      S.symbolContent(label),
      S.listElements(instrs).map(parseInstr),
      meta,
    )
  },
})
