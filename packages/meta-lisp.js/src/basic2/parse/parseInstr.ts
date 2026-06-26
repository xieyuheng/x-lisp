import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"
import { parseType } from "./parseType.ts"
import { parseOperand } from "./parseOperand.ts"

export function parseInstr(sexp: S.Sexp): B.Instr {
  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])

  if (head.content === "=") {
    return parseAssignForm(list)
  }

  if (head.content === "store") {
    return parseStoreForm(list)
  }

  throw new S.ErrorWithSourceLocation(
    `[parseInstr] unknown instr form: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}

function parseAssignForm(list: S.ListSexp): B.Instr {
  const elements = list.elements
  const dest = S.asSymbolSexp(elements[1]).content
  const type = parseType(elements[2])
  const innerList = S.asListSexp(elements[3])
  const op = S.asSymbolSexp(innerList.elements[0]).content

  if (B.binaryOpNames.has(op)) {
    const left = parseOperand(innerList.elements[1])
    const right = parseOperand(innerList.elements[2])
    return B.BinaryInstr(dest, type, op, left, right)
  }

  if (B.unaryOpNames.has(op)) {
    const operand = parseOperand(innerList.elements[1])
    return B.UnaryInstr(dest, type, op, operand)
  }

  if (op === "load") {
    const pointer = parseOperand(innerList.elements[1])
    return B.LoadInstr(dest, type, pointer)
  }

  if (op === "call") {
    const target = parseOperand(innerList.elements[1])
    const operands = innerList.elements.slice(2).map(parseOperand)
    return B.CallInstr(dest, type, target, operands)
  }

  if (op === "apply") {
    const target = parseOperand(innerList.elements[1])
    const operands = innerList.elements.slice(2).map(parseOperand)
    return B.ApplyInstr(dest, type, target, operands)
  }

  if (op === "size-of") {
    const targetType = parseType(innerList.elements[1])
    return B.SizeOfInstr(dest, targetType)
  }

  if (op === "offset-of") {
    const structType = parseType(innerList.elements[1])
    const pathList = S.asListSexp(innerList.elements[2])
    const path = pathList.elements.map((e) => S.asSymbolSexp(e).content)
    return B.OffsetOfInstr(dest, structType, path)
  }

  throw new S.ErrorWithSourceLocation(
    `[parseInstr] unknown op: ${op}`,
    list.location,
  )
}

function parseStoreForm(list: S.ListSexp): B.StoreInstr {
  const elements = list.elements
  const type = parseType(elements[1])
  const pointer = parseOperand(elements[2])
  const value = parseOperand(elements[3])
  return B.StoreInstr(type, pointer, value)
}
