import * as S from "@xieyuheng/sexp.js"
import * as Xvm2 from "../index.ts"

export function parseOperand(sexp: S.Sexp): Xvm2.Operand {
  if (S.isSymbolSexp(sexp)) {
    return Xvm2.VarOperand(sexp.content)
  }

  if (S.isIntSexp(sexp)) {
    return Xvm2.IntOperand(sexp.content)
  }

  if (S.isFloatSexp(sexp)) {
    return Xvm2.FloatOperand(sexp.content)
  }

  if (S.isStringSexp(sexp)) {
    return Xvm2.StringOperand(sexp.content)
  }

  if (S.isListSexp(sexp)) {
    const elements = sexp.elements
    if (elements.length === 0) {
      throw new S.ErrorWithSourceLocation(
        `[parseOperand] empty list is not an operand: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }

    const head = S.asSymbolSexp(elements[0]).content

    if (head === "@quote" && elements.length === 2) {
      const quoted = elements[1]
      if (S.isSymbolSexp(quoted)) {
        return Xvm2.SymbolOperand(quoted.content)
      }
      throw new S.ErrorWithSourceLocation(
        `[parseOperand] expected symbol after quote, got: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }

    if (head === "fn" && elements.length === 2) {
      return Xvm2.FnOperand(S.asSymbolSexp(elements[1]).content)
    }

    if (head === "prim" && elements.length === 2) {
      return Xvm2.PrimOperand(S.asSymbolSexp(elements[1]).content)
    }

    if (head === "global" && elements.length === 2) {
      return Xvm2.GlobalOperand(S.asSymbolSexp(elements[1]).content)
    }

    if (head === "label" && elements.length === 2) {
      return Xvm2.LabelOperand(S.asSymbolSexp(elements[1]).content)
    }
  }

  throw new S.ErrorWithSourceLocation(
    `[parseOperand] unknown operand: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}
