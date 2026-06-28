import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"

export function parseExp(sexp: S.Sexp): B.Exp {
  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])
  const elements = list.elements

  switch (head.content) {
    case "address": {
      const name = S.asSymbolSexp(elements[1]).content
      return B.AddressExp(name)
    }
    case "int": {
      const value = S.asIntSexp(elements[1]).content
      return B.IntExp(value)
    }
    case "float": {
      const value = S.asFloatSexp(elements[1]).content
      return B.FloatExp(value)
    }
    case "string": {
      const content = S.asStringSexp(elements[1]).content
      return B.StringExp(content)
    }
    case "struct": {
      if (elements.length < 3) {
        throw new S.ErrorWithSourceLocation(
          "struct requires a name and at least one field",
          sexp.location,
        )
      }
      const name = S.asSymbolSexp(elements[1]).content
      const fields: Record<string, B.Exp> = {}
      for (let i = 2; i < elements.length; i++) {
        const field = S.asListSexp(elements[i])
        const fieldElements = field.elements
        if (fieldElements.length !== 2) {
          throw new S.ErrorWithSourceLocation(
            "struct field must have two elements: name and value",
            field.location,
          )
        }
        const fieldName = S.asSymbolSexp(fieldElements[0]).content
        if (fields[fieldName] !== undefined) {
          throw new S.ErrorWithSourceLocation(
            `duplicate struct field: ${fieldName}`,
            field.location,
          )
        }
        fields[fieldName] = parseExp(fieldElements[1])
      }
      return B.StructExp(name, fields)
    }
    case "pointer": {
      const target = parseExp(elements[1])
      return B.PointerExp(target)
    }
    case "array": {
      const expElements = elements.slice(1).map(parseExp)
      return B.ArrayExp(expElements)
    }
    default: {
      throw new S.ErrorWithSourceLocation(
        `[parseExp] unknown exp form: ${S.formatSexp(sexp)}`,
        sexp.location,
      )
    }
  }
}
