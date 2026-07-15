import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"
import { parseData } from "./parseData.ts"

const parseOperandRouter: S.Router<X86.Operand> = S.createRouter<X86.Operand>({
  "`(reg ,name)": ({ name }, { location }) => {
    return X86.RegOperand(S.asSymbolSexp(name).content)
  },

  "`(label ,name)": ({ name }, { location }) => {
    return X86.LabelOperand(S.asSymbolSexp(name).content)
  },

  "(cons* 'address rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length !== 1) {
      let message = `(address name) takes exactly one symbol`
      throw new Error(message)
    }
    return X86.AddressOperand(S.asSymbolSexp(elements[0]).content)
  },

  "(cons* 'deref first rest)": ({ first, rest }, { location }) => {
    if (
      first.kind === "ListSexp" &&
      first.elements.length >= 2 &&
      first.elements[0].kind === "SymbolSexp" &&
      first.elements[0].content === "address"
    ) {
      return X86.DerefOperand(parseAddressOperand(first))
    }

    if (
      first.kind === "ListSexp" &&
      first.elements.length >= 2 &&
      first.elements[0].kind === "SymbolSexp" &&
      first.elements[0].content === "reg"
    ) {
      const baseName = parseRegName(first)
      const elements = S.asListSexp(rest).elements
      if (elements.length === 0) {
        return X86.RegDerefOperand(baseName, undefined, undefined, undefined)
      }
      if (elements.length === 1) {
        const disp = parseDisplacement(elements[0])
        return X86.RegDerefOperand(baseName, undefined, undefined, disp)
      }
      if (elements.length === 2) {
        const index = parseRegName(elements[0])
        const scale = parseImmValue(elements[1])
        return X86.RegDerefOperand(baseName, index, scale, undefined)
      }
      const index = parseRegName(elements[0])
      const scale = parseImmValue(elements[1])
      const disp = parseDisplacement(elements[2])
      return X86.RegDerefOperand(baseName, index, scale, disp)
    }

    let message =
      `(deref ...) expects (address ...) or (reg ...) as first argument, ` +
      `got: ${S.formatSexp(first)}`
    throw new Error(message)
  },

  "`(cc ,code)": ({ code }, { location }) => {
    return X86.CcOperand(S.asSymbolSexp(code).content)
  },

  "`(var ,name)": ({ name }, { location }) => {
    return X86.VarOperand(S.asSymbolSexp(name).content)
  },

  "`(extern ,name)": ({ name }, { location }) => {
    return X86.ExternOperand(S.asSymbolSexp(name).content)
  },
})

export function parseOperand(sexp: S.Sexp): X86.Operand {
  if (sexp.kind === "IntSexp") {
    return X86.ImmOperand(sexp.content)
  }

  try {
    return parseOperandRouter(sexp)
  } catch {
    if (sexp.kind === "SymbolSexp") {
      let message =
        `unexpected symbol "${sexp.content}" in operand position; ` +
        `did you mean (address ${sexp.content}) or (var ${sexp.content})?`
      throw new Error(message)
    }
    return X86.DataOperand(parseData(sexp))
  }
}

function parseRegName(sexp: S.Sexp): string {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (reg ...), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  const elements = sexp.elements
  if (elements.length !== 2) {
    let message = `expected (reg name), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "reg") {
    let message = `expected (reg name), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
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
  throw new Error(message)
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
      return X86.OffsetOfDisplacement(structType, fields)
    }
    let message = `expected integer or (offset-of ...), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  return X86.IntDisplacement(parseImmValue(sexp))
}

function parseAddressOperand(sexp: S.Sexp): X86.AddressOperand {
  if (sexp.kind !== "ListSexp") {
    let message = `expected (address name), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  const elements = sexp.elements
  if (elements.length !== 2) {
    let message = `expected (address name), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  if (elements[0].kind !== "SymbolSexp" || elements[0].content !== "address") {
    let message = `expected (address name), got: ${S.formatSexp(sexp)}`
    throw new Error(message)
  }
  return X86.AddressOperand(S.asSymbolSexp(elements[1]).content)
}
