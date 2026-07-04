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

  const rest = innerElements.slice(1)
  const attributeStart = rest.findIndex(isAttributeKey)
  const operandSexps =
    attributeStart === -1 ? rest : rest.slice(0, attributeStart)
  const attributeSexps = attributeStart === -1 ? [] : rest.slice(attributeStart)

  const operands = operandSexps.map(parseOperand)
  const attributes = parseAttributes(attributeSexps)

  return B.Instr(id, type, op, operands, attributes)
}

function isAttributeKey(sexp: S.Sexp): boolean {
  if (S.isKeywordSexp(sexp)) return true
  return S.isSymbolSexp(sexp) && sexp.content.startsWith(":")
}

function attributeKeyName(sexp: S.Sexp): string {
  if (S.isKeywordSexp(sexp)) return sexp.content
  return S.asSymbolSexp(sexp).content.slice(1)
}

function parseAttributes(sexps: Array<S.Sexp>): Record<string, B.Attribute> {
  const attributes: Record<string, B.Attribute> = {}
  let i = 0
  while (i < sexps.length) {
    const keySexp = sexps[i]
    if (!isAttributeKey(keySexp)) {
      throw new S.ErrorWithSourceLocation(
        `[parseInstr] expected attribute key, got: ${S.formatSexp(keySexp)}`,
        keySexp.location,
      )
    }
    const attributeKey = attributeKeyName(keySexp)
    i++
    const valueSexp = sexps[i]
    i++
    attributes[attributeKey] = parseAttribute(valueSexp)
  }
  return attributes
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
