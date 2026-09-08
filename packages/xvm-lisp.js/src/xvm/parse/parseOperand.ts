import * as S from "@xieyuheng/sexp.js"
import * as Xvm from "../index.ts"

export function parseOperand(sexp: S.Sexp): Xvm.Operand {
  if (S.isSymbolSexp(sexp)) {
    return Xvm.VarOperand(sexp.content)
  }

  if (S.isIntSexp(sexp)) {
    return Xvm.IntOperand(sexp.content)
  }

  if (S.isFloatSexp(sexp)) {
    return Xvm.FloatOperand(sexp.content)
  }

  if (S.isStringSexp(sexp)) {
    return Xvm.StringOperand(sexp.content)
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
        return Xvm.SymbolOperand(quoted.content)
      }
      throw new S.ErrorWithSourceLocation(
        `[parseOperand] expected symbol after quote, got: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }

    if (head === "u16" && elements.length === 2 && S.isIntSexp(elements[1])) {
      return Xvm.U16Operand(Number(elements[1].content))
    }

    if (head === "fn" && elements.length === 2) {
      return Xvm.FnOperand(S.asSymbolSexp(elements[1]).content)
    }

    if (head === "prim" && elements.length === 2) {
      return Xvm.PrimOperand(S.asSymbolSexp(elements[1]).content)
    }

    if (head === "global" && elements.length === 2) {
      return Xvm.GlobalOperand(S.asSymbolSexp(elements[1]).content)
    }

    if (head === "label" && elements.length === 2) {
      return Xvm.LabelOperand(S.asSymbolSexp(elements[1]).content)
    }
  }

  throw new S.ErrorWithSourceLocation(
    `[parseOperand] unknown operand: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}
