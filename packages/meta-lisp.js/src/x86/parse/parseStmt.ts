import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"
import { parseData } from "./parseData.ts"
import { parseInstr } from "./parseInstr.ts"

export const parseStmt: S.Router<X86.Stmt> = S.createRouter<X86.Stmt>({
  "(cons* 'define-code name blocks)": ({ name, blocks }, { location }) => {
    const blockSexps = S.asListSexp(blocks).elements
    const parsedBlocks = blockSexps.map((bs) => parseBlock(bs))
    return X86.DefineCodeStmt(
      S.asSymbolSexp(name).content,
      parsedBlocks,
    )
  },

  "`(define-data ,name ,value)": ({ name, value }, { location }) => {
    return X86.DefineDataStmt(
      S.asSymbolSexp(name).content,
      parseData(value),
    )
  },

  "`(define-metadata ,name ,value)": ({ name, value }, { location }) => {
    return X86.DefineMetadataStmt(
      S.asSymbolSexp(name).content,
      parseData(value),
    )
  },

  "(cons* 'define-struct name fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseTypeFields(fields)
    return X86.DefineStructStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
    )
  },

  "`(define-space ,name ,size)": ({ name, size }, { location }) => {
    return X86.DefineSpaceStmt(
      S.asSymbolSexp(name).content,
      parseData(size),
    )
  },
})

function parseBlock(sexp: S.Sexp): X86.Block {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (block name ...), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  const elements = sexp.elements
  if (elements.length < 2) {
    let message = `expected (block name ...), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "block") {
    let message = `expected (block name ...), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  const blockName = S.asSymbolSexp(elements[1]).content
  const instrs = elements.slice(2).map((i) => parseInstr(i))
  return X86.Block(blockName, instrs
    )
}

function parseTypeFields(rest: S.Sexp): Record<string, X86.Type> {
  const elements = S.asListSexp(rest).elements
  const result: Record<string, X86.Type> = {}
  for (const elem of elements) {
    if (elem.kind !== "ListSexp" || elem.elements.length !== 2) {
      let message = `expected (field-name type), got: ${S.formatSexp(elem)}`
      throw new Error(message)
    }
    const fieldName = S.asSymbolSexp(elem.elements[0]).content
    const type = parseType(elem.elements[1])
    result[fieldName] = type
  }
  return result
}

function parseType(sexp: S.Sexp): X86.Type {
  if (sexp.kind === "SymbolSexp") {
    return X86.NamedType(sexp.content)
  }
  if (sexp.kind === "ListSexp") {
    const elements = sexp.elements
    if (
      elements.length === 3 &&
      elements[0].kind === "SymbolSexp" &&
      elements[0].content === "array-t"
    ) {
      const element = parseType(elements[1])
      const length = Number(S.asIntSexp(elements[2]).content)
      return X86.ArrayType(element, length)
    }
  }
  let message = `expected type name or (array-t element-type length), got: ${S.formatSexp(sexp)}`
  throw new Error(message)
}
