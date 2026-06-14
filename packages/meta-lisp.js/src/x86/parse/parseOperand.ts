import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export const parseOperand: S.Router<X86.Operand> = S.createRouter<X86.Operand>({
  "`(reg ,name)": ({ name }, { location }) => {
    return X86.RegOperand(S.asSymbolSexp(name).content, location)
  },

  "`(imm ,value)": ({ value }, { location }) => {
    if (value.kind !== "IntSexp") {
      let message = "imm operand requires an integer value"
      throw new S.ErrorWithSourceLocation(message, location)
    }
    return X86.ImmOperand(S.asIntSexp(value).content, location)
  },

  "(cons* 'label path)": ({ path }, { location }) => {
    const elements = S.asListSexp(path).elements.map(
      (x) => S.asSymbolSexp(x).content,
    )
    return X86.LabelOperand(elements[0], elements.slice(1), location)
  },

  "`(label-imm ,label)": ({ label }, { location }) => {
    const inner = parseLabelOperand(label)
    return X86.LabelImmOperand(inner, location)
  },

  "`(label-deref ,label)": ({ label }, { location }) => {
    const inner = parseLabelOperand(label)
    return X86.LabelDerefOperand(inner, location)
  },

  "(cons* 'reg-deref base rest)": ({ base, rest }, { location }) => {
    const baseName = parseRegName(base)
    const elements = S.asListSexp(rest).elements
    if (elements.length === 0) {
      return X86.RegDerefOperand(
        baseName,
        undefined,
        undefined,
        undefined,
        location,
      )
    }
    if (elements.length === 1) {
      const disp = parseImmValue(elements[0])
      return X86.RegDerefOperand(baseName, undefined, undefined, disp, location)
    }
    if (elements.length === 2) {
      const index = parseRegName(elements[0])
      const scale = parseImmValue(elements[1])
      return X86.RegDerefOperand(baseName, index, scale, undefined, location)
    }
    const index = parseRegName(elements[0])
    const scale = parseImmValue(elements[1])
    const disp = parseImmValue(elements[2])
    return X86.RegDerefOperand(baseName, index, scale, disp, location)
  },

  "`(cc ,code)": ({ code }, { location }) => {
    return X86.CcOperand(S.asSymbolSexp(code).content, location)
  },

  "`(var ,name)": ({ name }, { location }) => {
    return X86.VarOperand(S.asSymbolSexp(name).content, location)
  },

  "`(external-label ,name)": ({ name }, { location }) => {
    return X86.ExternalLabelOperand(S.asSymbolSexp(name).content, location)
  },
})

function parseRegName(sexp: S.Sexp): string {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (reg ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  const elements = sexp.elements
  if (elements.length !== 2) {
    let message = `expected (reg name), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "reg") {
    let message = `expected (reg name), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  return S.asSymbolSexp(elements[1]).content
}

function parseImmValue(sexp: S.Sexp): bigint {
  if (sexp.kind === "IntSexp") {
    return sexp.content
  }
  if (sexp.kind === "SymbolSexp" && sexp.content.startsWith("-")) {
    return BigInt(sexp.content)
  }
  let message = `expected integer, got: ${S.formatSexp(sexp)}`
  throw new S.ErrorWithSourceLocation(message, sexp.location)
}

function parseLabelOperand(sexp: S.Sexp): X86.LabelOperand {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (label ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  const elements = sexp.elements
  if (elements.length < 2) {
    let message = `expected (label name ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "label") {
    let message = `expected (label ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  const path = elements.slice(1).map((x) => S.asSymbolSexp(x).content)
  return X86.LabelOperand(path[0], path.slice(1), sexp.location)
}
