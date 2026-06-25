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

  "`(define-data ,name ,value)": ({ name, value }, { location }) => {
    return X86.DefineDataStmt(
      S.asSymbolSexp(name).content,
      parseExp(value),
      location,
    )
  },

  "`(define-metadata ,name ,value)": ({ name, value }, { location }) => {
    return X86.DefineMetadataStmt(
      S.asSymbolSexp(name).content,
      parseExp(value),
      location,
    )
  },

  "(cons* 'define-struct name fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseFields(fields)
    const { structName, parameters } = parseStructName(name, location)
    return X86.DefineStructStmt(structName, parameters, parsedFields, location)
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

function parseStructName(
  name: S.Sexp,
  location: S.SourceLocation,
): {
  structName: string
  parameters: string[]
} {
  if (name.kind === "ListSexp") {
    const elements = name.elements
    if (elements.length < 1) {
      let message = `expected (define-struct (name ...) ...)`
      throw new S.ErrorWithSourceLocation(message, location)
    }
    return {
      structName: S.asSymbolSexp(elements[0]).content,
      parameters: elements.slice(1).map((p) => S.asSymbolSexp(p).content),
    }
  }
  return {
    structName: S.asSymbolSexp(name).content,
    parameters: [],
  }
}
