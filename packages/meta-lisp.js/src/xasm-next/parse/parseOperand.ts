import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"

export const parseOperand: S.Router<N.Operand> = S.createRouter<N.Operand>({
  "`(reg ,name)": ({ name }, { location }) => {
    return N.RegOperand(S.asSymbolSexp(name).content, location)
  },

  "`(imm ,value)": ({ value }, { location }) => {
    if (value.kind !== "IntSexp") {
      throw new S.ErrorWithSourceLocation(
        "imm operand requires an integer value",
        location,
      )
    }
    return N.ImmOperand(S.asIntSexp(value).content, location)
  },

  "(cons* 'label . path)": ({ path }, { location }) => {
    const elements = S.asListSexp(path).elements.map(
      (x) => S.asSymbolSexp(x).content,
    )
    return N.LabelOperand(elements[0], elements.slice(1), location)
  },

  "`(label-imm ,label)": ({ label }, { location }) => {
    const inner = parseLabelOperand(label)
    return N.LabelImmOperand(inner, location)
  },

  "`(label-deref ,label)": ({ label }, { location }) => {
    const inner = parseLabelOperand(label)
    return N.LabelDerefOperand(inner, location)
  },

  "(cons* 'reg-deref base . rest)": ({ base, rest }, { location }) => {
    const baseName = parseRegName(base)
    const elements = S.asListSexp(rest).elements
    if (elements.length === 0) {
      throw new S.ErrorWithSourceLocation(
        "reg-deref requires at least a displacement",
        location,
      )
    }
    if (elements.length === 1) {
      const disp = parseImmValue(elements[0])
      return N.RegDerefOperand(baseName, undefined, undefined, disp, location)
    }
    if (elements.length === 2) {
      const index = parseRegName(elements[0])
      const scale = parseImmValue(elements[1])
      return N.RegDerefOperand(baseName, index, scale, undefined, location)
    }
    const index = parseRegName(elements[0])
    const scale = parseImmValue(elements[1])
    const disp = parseImmValue(elements[2])
    return N.RegDerefOperand(baseName, index, scale, disp, location)
  },

  "`(cc ,code)": ({ code }, { location }) => {
    return N.CcOperand(S.asSymbolSexp(code).content, location)
  },

  "`(var ,name)": ({ name }, { location }) => {
    return N.VarOperand(S.asSymbolSexp(name).content, location)
  },
})

function parseRegName(sexp: S.Sexp): string {
  if (sexp.kind !== "ListSexp") {
    throw new S.ErrorWithSourceLocation(
      `expected (reg ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  const elements = sexp.elements
  if (elements.length !== 2)
    throw new S.ErrorWithSourceLocation(
      `expected (reg name), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "reg")
    throw new S.ErrorWithSourceLocation(
      `expected (reg name), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  return S.asSymbolSexp(elements[1]).content
}

function parseImmValue(sexp: S.Sexp): bigint {
  if (sexp.kind === "IntSexp") {
    return sexp.content
  }
  if (sexp.kind === "SymbolSexp" && sexp.content.startsWith("-")) {
    return BigInt(sexp.content)
  }
  throw new S.ErrorWithSourceLocation(
    `expected integer, got: ${S.formatSexp(sexp)}`,
    sexp.location,
  )
}

function parseLabelOperand(sexp: S.Sexp): N.LabelOperand {
  if (sexp.kind !== "ListSexp") {
    throw new S.ErrorWithSourceLocation(
      `expected (label ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  const elements = sexp.elements
  if (elements.length < 2) {
    throw new S.ErrorWithSourceLocation(
      `expected (label name ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "label") {
    throw new S.ErrorWithSourceLocation(
      `expected (label ...), got: ${S.formatSexp(sexp)}`,
      sexp.location,
    )
  }
  const path = elements.slice(1).map((x) => S.asSymbolSexp(x).content)
  return N.LabelOperand(path[0], path.slice(1), sexp.location)
}
