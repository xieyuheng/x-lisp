import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export const parseData: S.Router<X86.Data> = S.createRouter<X86.Data>({
  "(cons* 'struct rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length < 2) {
      let message = "struct requires a name and at least one field"
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }
    if (elements[0].kind !== "SymbolSexp") {
      let message = "struct name must be a symbol"
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }
    const name = S.asSymbolSexp(elements[0]).content
    const fields: Record<string, X86.Data> = {}
    for (let i = 1; i < elements.length; i++) {
      const field = S.asListSexp(elements[i])
      const fieldElements = field.elements
      if (fieldElements.length !== 2) {
        let message = "struct field must have two elements: name and value"
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      const fieldName = S.asSymbolSexp(fieldElements[0]).content
      if (fields[fieldName] !== undefined) {
        let message = `duplicate struct field: ${fieldName}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
      fields[fieldName] = parseData(fieldElements[1])
    }
    return X86.StructData(name, fields
    )
  },

  "`(pointer ,target)": ({ target }, { location }) => {
    return X86.PointerData(parseData(target)
    )
  },

  "(cons* 'array rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    return X86.ArrayData(elements.map(parseData)
    )
  },

  "(cons* 'address rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length !== 1) {
      let message = "(address name) takes exactly one symbol"
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
    }
    return X86.AddressData(S.asSymbolSexp(elements[0]).content
    )
  },

  "(cons* target args)": ({ target }, { location }) => {
    let message = `[parseData] unexpected expression form starting with: ${S.formatSexp(target)}`
    throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
  },

  data: ({ data }, { location }) => {
    switch (data.kind) {
      case "IntSexp":
        return X86.IntData(S.asIntSexp(data).content
    )
      case "StringSexp":
        return X86.StringData(S.asStringSexp(data).content
    )
      default: {
        let message = `unexpected data: ${S.formatSexp(data)}`
        throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
      }
    }
  },
})
