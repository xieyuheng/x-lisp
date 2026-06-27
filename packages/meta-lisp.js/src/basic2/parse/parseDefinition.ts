import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseType } from "./parseType.ts"
import { parseOperand } from "./parseOperand.ts"
import { parseBlock } from "./parseBlock.ts"

export function parseDefinition(sexp: S.Sexp): B.Definition {
  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])
  const elements = list.elements

  switch (head.content) {
    case "define-struct": {
      const name = S.asSymbolSexp(elements[1]).content
      const fields: Record<string, B.Type> = {}
      for (const field of elements.slice(2)) {
        const pair = S.asListSexp(field)
        const fieldName = S.asSymbolSexp(pair.elements[0]).content
        const fieldType = parseType(pair.elements[1])
        fields[fieldName] = fieldType
      }
      return B.StructDefinition(name, fields)
    }

    case "define-function": {
      const name = S.asSymbolSexp(elements[1]).content
      const blocks = elements.slice(2).map(parseBlock)
      return B.FunctionDefinition(name, blocks)
    }

    case "define-variable": {
      const name = S.asSymbolSexp(elements[1]).content
      const init = elements.length >= 3 ? parseOperand(elements[2]) : null
      return B.VariableDefinition(name, init)
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[parseDefinition] unknown definition form: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }
  }
}
