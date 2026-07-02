import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export const parseExp: S.Router<X86.Exp> = S.createRouter<X86.Exp>({
  "(cons* 'struct rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length < 2) {
      let message = "struct requires a name and at least one field"
      throw new S.ErrorWithSourceLocation(message, location)
    }
    if (elements[0].kind !== "SymbolSexp") {
      let message = "struct name must be a symbol"
      throw new S.ErrorWithSourceLocation(message, location)
    }
    const name = S.asSymbolSexp(elements[0]).content
    const fields: Record<string, X86.Exp> = {}
    for (let i = 1; i < elements.length; i++) {
      const field = S.asListSexp(elements[i])
      const fieldElements = field.elements
      if (fieldElements.length !== 2) {
        let message = "struct field must have two elements: name and value"
        throw new S.ErrorWithSourceLocation(message, field.location)
      }
      const fieldName = S.asSymbolSexp(fieldElements[0]).content
      if (fields[fieldName] !== undefined) {
        let message = `duplicate struct field: ${fieldName}`
        throw new S.ErrorWithSourceLocation(message, field.location)
      }
      fields[fieldName] = parseExp(fieldElements[1])
    }
    return X86.StructExp(name, fields, location)
  },

  "`(pointer ,target)": ({ target }, { location }) => {
    return X86.PointerExp(parseExp(target), location)
  },

  "(cons* 'array rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    return X86.ArrayExp(elements.map(parseExp), location)
  },

  "(cons* 'address rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length !== 1) {
      let message = "(address name) takes exactly one symbol"
      throw new S.ErrorWithSourceLocation(message, location)
    }
    return X86.AddressExp(S.asSymbolSexp(elements[0]).content, location)
  },

  "(cons* target args)": ({ target }, { location }) => {
    let message = `[parseExp] unexpected expression form starting with: ${S.formatSexp(target)}`
    throw new S.ErrorWithSourceLocation(message, location)
  },

  data: ({ data }, { location }) => {
    switch (data.kind) {
      case "IntSexp":
        return X86.IntExp(S.asIntSexp(data).content, location)
      case "StringSexp":
        return X86.StringExp(S.asStringSexp(data).content, location)
      default: {
        let message = `unexpected exp: ${S.formatSexp(data)}`
        throw new S.ErrorWithSourceLocation(message, location)
      }
    }
  },
})
