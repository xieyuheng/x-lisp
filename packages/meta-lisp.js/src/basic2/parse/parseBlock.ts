import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseInstr } from "./parseInstr.ts"
import { parseTerminator } from "./parseTerminator.ts"
import { parseType } from "./parseType.ts"

export function parseBlock(sexp: S.Sexp): B.Block {
  const list = S.asListSexp(sexp)
  const elements = list.elements

  let label: string
  let parameters: Array<[string, B.Type]>
  let startIndex: number

  if (S.isSymbolSexp(elements[1])) {
    label = elements[1].content
    parameters = []
    startIndex = 2
  } else {
    const labelParamList = S.asListSexp(elements[1])
    const lpElements = labelParamList.elements
    label = S.asSymbolSexp(lpElements[0]).content
    parameters = lpElements.slice(1).map((param) => {
      const pair = S.asListSexp(param)
      const name = S.asSymbolSexp(pair.elements[0]).content
      const type = parseType(pair.elements[1])
      return [name, type] as [string, B.Type]
    })
    startIndex = 2
  }

  const rest = elements.slice(startIndex)
  if (rest.length === 0) {
    throw new S.ErrorWithSourceLocation(
      `[parseBlock] block must have at least a terminator`,
      list.location,
    )
  }

  const instrs = rest.slice(0, -1).map(parseInstr)
  const terminator = parseTerminator(rest[rest.length - 1])

  return B.Block(label, parameters, instrs, terminator)
}
