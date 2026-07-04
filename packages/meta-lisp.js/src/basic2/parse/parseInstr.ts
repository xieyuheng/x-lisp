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
  const operands = parseOperands(rest)
  const attributes = parseAttributes(rest)

  return B.Instr(id, type, op, operands, attributes)
}

function parseOperands(sexps: Array<S.Sexp>): Array<B.Operand> {
  const operands: Array<B.Operand> = []
  let i = 0
  while (i < sexps.length) {
    if (isAttributeKey(sexps[i])) {
      i += 2
    } else {
      operands.push(parseOperand(sexps[i]))
      i += 1
    }
  }
  return operands
}

function parseAttributes(sexps: Array<S.Sexp>): Record<string, B.Attribute> {
  const attributes: Record<string, B.Attribute> = {}
  let i = 0
  while (i < sexps.length) {
    if (!isAttributeKey(sexps[i])) {
      i += 1
      continue
    }
    const attributeKey = attributeKeyName(sexps[i])
    const valueSexp = sexps[i + 1]
    if (valueSexp === undefined) {
      throw new S.ErrorWithSourceLocation(
        `[parseInstr] missing value for attribute :${attributeKey}`,
        sexps[i].location,
      )
    }
    attributes[attributeKey] = parseAttribute(valueSexp)
    i += 2
  }
  return attributes
}

function isAttributeKey(sexp: S.Sexp): boolean {
  if (S.isKeywordSexp(sexp)) return true
  return S.isSymbolSexp(sexp) && sexp.content.startsWith(":")
}

function attributeKeyName(sexp: S.Sexp): string {
  if (S.isKeywordSexp(sexp)) return sexp.content
  return S.asSymbolSexp(sexp).content.slice(1)
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
