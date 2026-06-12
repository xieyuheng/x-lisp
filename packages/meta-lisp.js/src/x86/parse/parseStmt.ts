import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"
import { parseExp } from "./parseExp.ts"
import { parseInstr } from "./parseInstr.ts"

export const parseStmt: S.Router<X86.Stmt> = S.createRouter<X86.Stmt>({
  "(cons* 'define-code name blocks)": ({ name, blocks }, { location }) => {
    const blockSexps = S.asListSexp(blocks).elements
    const parsedBlocks = blockSexps.map((bs) => parseBlock(bs))
    return X86.DefineCodeStmt(
      S.asSymbolSexp(name).content,
      parsedBlocks,
      location,
    )
  },

  "(cons* 'define-data name fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseFields(fields)
    return X86.DefineDataStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
      location,
    )
  },

  "(cons* 'define-metadata name fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseFields(fields)
    return X86.DefineMetadataStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
      location,
    )
  },

  "(cons* 'define-struct name fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseFields(fields)
    return X86.DefineStructStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
      location,
    )
  },

  "`(define-space ,name ,size)": ({ name, size }, { location }) => {
    return X86.DefineSpaceStmt(
      S.asSymbolSexp(name).content,
      parseExp(size),
      location,
    )
  },

  "`(claim ,name ,type)": ({ name, type }, { location }) => {
    return X86.ClaimStmt(S.asSymbolSexp(name).content, parseExp(type), location)
  },

  "`(claim-code-metadata ,type)": ({ type }, { location }) => {
    return X86.ClaimCodeMetadataStmt(parseExp(type), location)
  },
})

function parseBlock(sexp: S.Sexp): X86.Block {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (block name ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  const elements = sexp.elements
  if (elements.length < 2) {
    let message = `expected (block name ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "block") {
    let message = `expected (block name ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  const blockName = S.asSymbolSexp(elements[1]).content
  const instrs = elements.slice(2).map((i) => parseInstr(i))
  return X86.Block(blockName, instrs, sexp.location)
}

function parseFields(rest: S.Sexp): Array<X86.StructField> {
  const elements = S.asListSexp(rest).elements
  return elements.map((elem) => {
    if (elem.kind !== "ListSexp" || elem.elements.length !== 2) {
      let message = `expected (field-name value), got: ${S.formatSexp(elem)}`
      throw new S.ErrorWithSourceLocation(message, elem.location)
    }
    const fieldName = S.asSymbolSexp(elem.elements[0]).content
    const fieldExp = parseExp(elem.elements[1])
    return X86.StructField(fieldName, fieldExp)
  })
}
