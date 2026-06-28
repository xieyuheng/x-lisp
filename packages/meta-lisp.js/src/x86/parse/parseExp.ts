import * as S from "@xieyuheng/sexp.js"
import * as X86 from "../index.ts"

export const parseExp: S.Router<X86.Exp> = S.createRouter<X86.Exp>({
  "(cons* '@struct rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length === 0) {
      let message = "@struct requires at least one field"
      throw new S.ErrorWithSourceLocation(message, location)
    }
    let name: string | undefined
    let fieldStart: number
    if (elements[0].kind === "SymbolSexp") {
      name = S.asSymbolSexp(elements[0]).content
      fieldStart = 1
    } else {
      fieldStart = 0
    }
    const fields: Array<X86.StructField> = []
    for (let i = fieldStart; i < elements.length; i++) {
      const field = S.asListSexp(elements[i])
      const fieldElements = field.elements
      if (fieldElements.length !== 2) {
        let message = "@struct field must have two elements: name and value"
        throw new S.ErrorWithSourceLocation(message, field.location)
      }
      const fieldName = S.asSymbolSexp(fieldElements[0]).content
      const fieldExp = parseExp(fieldElements[1])
      fields.push(X86.StructField(fieldName, fieldExp))
    }
    return X86.StructExp(name, fields, location)
  },

  "`(@pointer ,target)": ({ target }, { location }) => {
    return X86.PointerExp(parseExp(target), location)
  },

  "`(@array . elements)": ({ elements }, { location }) => {
    const items = S.asListSexp(elements).elements
    return X86.ArrayExp(items.map(parseExp), location)
  },

  "(cons* '@address rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length !== 1) {
      let message = `(@address name) takes exactly one symbol`
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
      case "SymbolSexp":
        return X86.VarExp(S.asSymbolSexp(data).content, location)
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
