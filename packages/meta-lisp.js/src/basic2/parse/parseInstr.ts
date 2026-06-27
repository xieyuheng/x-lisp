import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseOperand } from "./parseOperand.ts"
import { parseType } from "./parseType.ts"

export function parseInstr(sexp: S.Sexp): B.Instr {
  const list = S.asListSexp(sexp)
  const elements = list.elements
  const head = S.asSymbolSexp(elements[0])

  if (head.content !== "=") {
    throw new S.ErrorWithSourceLocation(
      `[parseInstr] expected '=', got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }

  const id = S.asSymbolSexp(elements[1]).content
  const type = parseType(elements[2])
  const innerList = S.asListSexp(elements[3])
  const innerElements = innerList.elements
  const op = S.asSymbolSexp(innerElements[0]).content
  const operands = innerElements.slice(1).map(parseOperand)

  const attributes: Record<string, B.Attribute> = {}
  let i = 4
  while (i < elements.length) {
    const keySexp = elements[i]
    if (S.isKeywordSexp(keySexp)) {
      const attributeKey = keySexp.content
      i++
      const valueSexp = elements[i]
      i++
      attributes[attributeKey] = parseAttribute(valueSexp)
    } else if (S.isSymbolSexp(keySexp)) {
      const key = keySexp.content
      if (!key.startsWith(":")) {
        throw new S.ErrorWithSourceLocation(
          `[parseInstr] attribute key must start with ':', got: ${key}`,
          keySexp.location,
        )
      }
      const attributeKey = key.slice(1)
      i++
      const valueSexp = elements[i]
      i++
      attributes[attributeKey] = parseAttribute(valueSexp)
    } else {
      throw new S.ErrorWithSourceLocation(
        `[parseInstr] expected attribute key, got: ${S.formatSexp(keySexp)}`,
        keySexp.location,
      )
    }
  }

  return B.Instr(id, type, op, operands, attributes)
}

function parseAttribute(sexp: S.Sexp): B.Attribute {
  if (S.isSymbolSexp(sexp)) {
    return B.SymbolAttribute(sexp.content)
  }

  if (S.isIntSexp(sexp)) {
    return B.IntAttribute(Number(sexp.content))
  }

  if (S.isListSexp(sexp)) {
    return B.ListAttribute(sexp.elements.map(parseAttribute))
  }

  throw new S.ErrorWithSourceLocation(
    `[parseAttribute] unknown attribute value: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}
