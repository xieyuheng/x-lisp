import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseInstr } from "./parseInstr.ts"

export function parseBlock(sexp: S.Sexp): B.Block {
  const list = S.asListSexp(sexp)
  const elements = list.elements
  const label = S.asSymbolSexp(elements[1]).content
  const instrs = elements.slice(2).map(parseInstr)
  return B.Block(label, instrs)
}
