import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseBlock } from "./parseBlock.ts"
import { parseOperand } from "./parseOperand.ts"
import { parseType } from "./parseType.ts"

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
      const retType = parseType(elements[2])
      const blocks = elements.slice(3).map(parseBlock)
      return B.FunctionDefinition(name, retType, blocks)
    }

    case "declare-function": {
      const name = S.asSymbolSexp(elements[1]).content
      const type = parseType(elements[2])
      return B.FunctionDeclaration(name, type)
    }

    case "define-variable": {
      const name = S.asSymbolSexp(elements[1]).content
      const type = parseType(elements[2])
      const init = elements.length >= 4 ? parseOperand(elements[3]) : null
      return B.VariableDefinition(name, type, init)
    }

    case "declare-variable": {
      const name = S.asSymbolSexp(elements[1]).content
      const type = parseType(elements[2])
      return B.VariableDeclaration(name, type)
    }

    default: {
      throw new S.ErrorWithSourceLocation(
        `[parseDefinition] unknown definition form: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }
  }
}
