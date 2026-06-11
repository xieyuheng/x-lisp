import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"
import { parseExp } from "./parseExp.ts"
import { parseInstr } from "./parseInstr.ts"

export const parseStmt: S.Router<N.Stmt> = S.createRouter<N.Stmt>({
  "(cons* 'define-code name . blocks)": ({ name, blocks }, { location }) => {
    const blockSexps = S.asListSexp(blocks).elements
    const parsedBlocks = blockSexps.map((bs) => parseBlock(bs))
    return N.DefineCodeStmt(
      S.asSymbolSexp(name).content,
      parsedBlocks,
      location,
    )
  },

  "(cons* 'define-data name . fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseFields(fields)
    return N.DefineDataStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
      location,
    )
  },

  "(cons* 'define-metadata name . fields)": (
    { name, fields },
    { location },
  ) => {
    const parsedFields = parseFields(fields)
    return N.DefineMetadataStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
      location,
    )
  },

  "(cons* 'define-struct name . fields)": ({ name, fields }, { location }) => {
    const parsedFields = parseFields(fields)
    return N.DefineStructStmt(
      S.asSymbolSexp(name).content,
      parsedFields,
      location,
    )
  },

  "`(define-space ,name ,size)": ({ name, size }, { location }) => {
    return N.DefineSpaceStmt(
      S.asSymbolSexp(name).content,
      parseExp(size),
      location,
    )
  },

  "`(claim ,name ,type)": ({ name, type }, { location }) => {
    return N.ClaimStmt(S.asSymbolSexp(name).content, parseExp(type), location)
  },

  "`(claim-code-metadata ,type)": ({ type }, { location }) => {
    return N.ClaimCodeMetadataStmt(parseExp(type), location)
  },
})

function parseBlock(sexp: S.Sexp): N.Block {
  if (sexp.kind !== "ListSexp") {
    throw new S.ErrorWithSourceLocation(
      `expected (block name ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  const elements = sexp.elements
  if (elements.length < 2) {
    throw new S.ErrorWithSourceLocation(
      `expected (block name ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "block") {
    throw new S.ErrorWithSourceLocation(
      `expected (block name ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  const blockName = S.asSymbolSexp(elements[1]).content
  const instrs = elements.slice(2).map((i) => parseInstr(i))
  return N.Block(blockName, instrs, sexp.location)
}

function parseFields(rest: S.Sexp): Array<N.StructField> {
  const elements = S.asListSexp(rest).elements
  return elements.map((elem) => {
    if (elem.kind !== "ListSexp" || elem.elements.length !== 2) {
      throw new S.ErrorWithSourceLocation(
        `expected (field-name value), got: ${S.formatSexp(elem)}`,
        elem.location,
      )
    }
    const fieldName = S.asSymbolSexp(elem.elements[0]).content
    const fieldExp = parseExp(elem.elements[1])
    return N.StructField(fieldName, fieldExp)
  })
}
