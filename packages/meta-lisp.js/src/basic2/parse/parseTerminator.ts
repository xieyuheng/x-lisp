import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseOperand } from "./parseOperand.ts"

export function parseTerminator(sexp: S.Sexp): B.Terminator {
  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])
  const elements = list.elements

  switch (head.content) {
    case "return": {
      const value = parseOperand(elements[1])
      return B.ReturnTerminator(value)
    }

    case "goto": {
      const labelList = S.asListSexp(elements[1])
      const labelElements = labelList.elements
      const targetLabel = S.asSymbolSexp(labelElements[1]).content
      const args = labelElements.slice(2).map(parseOperand)
      return B.GotoTerminator(targetLabel, args)
    }

    case "branch": {
      const condition = parseOperand(elements[1])
      const thenList = S.asListSexp(elements[2])
      const thenElements = thenList.elements
      const thenLabel = S.asSymbolSexp(thenElements[1]).content
      const thenArgs = thenElements.slice(2).map(parseOperand)
      const elseList = S.asListSexp(elements[3])
      const elseElements = elseList.elements
      const elseLabel = S.asSymbolSexp(elseElements[1]).content
      const elseArgs = elseElements.slice(2).map(parseOperand)
      return B.BranchTerminator(
        condition,
        thenLabel,
        thenArgs,
        elseLabel,
        elseArgs,
      )
    }

    case "tail-call": {
      const target = parseOperand(elements[1])
      const operands = elements.slice(2).map(parseOperand)
      return B.TailCallTerminator(target, operands)
    }

    case "tail-apply": {
      const target = parseOperand(elements[1])
      const operands = elements.slice(2).map(parseOperand)
      return B.TailApplyTerminator(target, operands)
    }

    case "unreachable": {
      return B.UnreachableTerminator()
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[parseTerminator] unknown terminator form: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }
  }
}
