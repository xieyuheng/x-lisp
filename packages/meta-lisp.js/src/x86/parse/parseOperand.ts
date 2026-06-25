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

  "`(label ,name)": ({ name }, { location }) => {
    return X86.LabelOperand(S.asSymbolSexp(name).content, location)
  },

  "(cons* 'address rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length !== 1) {
      let message = `(address name) takes exactly one symbol`
      throw new S.ErrorWithSourceLocation(message, location)
    }
    return X86.AddressOperand(S.asSymbolSexp(elements[0]).content, location)
  },

  "`(deref ,address)": ({ address }, { location }) => {
    return X86.DerefOperand(parseAddressOperand(address), location)
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
      const disp = parseDisplacement(elements[0])
      return X86.RegDerefOperand(baseName, undefined, undefined, disp, location)
    }
    if (elements.length === 2) {
      const index = parseRegName(elements[0])
      const scale = parseImmValue(elements[1])
      return X86.RegDerefOperand(baseName, index, scale, undefined, location)
    }
    const index = parseRegName(elements[0])
    const scale = parseImmValue(elements[1])
    const disp = parseDisplacement(elements[2])
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

function parseDisplacement(sexp: S.Sexp): X86.Displacement {
  if (sexp.kind === "ListSexp") {
    const elements = sexp.elements
    if (
      elements.length >= 2 &&
      elements[0].kind === "SymbolSexp" &&
      elements[0].content === "offset-of"
    ) {
      const structType = S.asSymbolSexp(elements[1]).content
      const fields = elements.slice(2).map((x) => S.asSymbolSexp(x).content)
      return X86.OffsetOfDisplacement(structType, fields, sexp.location)
    }
    let message = `expected integer or (offset-of ...), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  return X86.IntDisplacement(parseImmValue(sexp), sexp.location)
}

function parseAddressOperand(sexp: S.Sexp): X86.AddressOperand {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (address name), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  const elements = sexp.elements
  if (elements.length !== 2) {
    let message = `expected (address name), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "address") {
    let message = `expected (address name), got: ${S.formatSexp(sexp)}`
    throw new S.ErrorWithSourceLocation(message, sexp.location)
  }
  return X86.AddressOperand(S.asSymbolSexp(elements[1]).content, sexp.location)
}
