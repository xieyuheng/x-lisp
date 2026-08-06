import * as S from "@xieyuheng/sexp.js"
import * as B from "../index.ts"

export function parseData(sexp: S.Sexp): B.Data {
  if (S.isIntSexp(sexp)) return B.IntData(sexp.content)
  if (S.isFloatSexp(sexp)) return B.FloatData(sexp.content)
  if (S.isStringSexp(sexp)) return B.TextData(sexp.content)

  const list = S.asListSexp(sexp)
  const head = S.asSymbolSexp(list.elements[0])
  const elements = list.elements

  switch (head.content) {
    case "address": {
      const name = S.asSymbolSexp(elements[1]).content
      return B.AddressData(name)
    }
    case "struct": {
      if (elements.length < 3) {
        throw new Error("struct requires a name and at least one field")
      }
      const name = S.asSymbolSexp(elements[1]).content
      const fields: Record<string, B.Data> = {}
      for (let i = 2; i < elements.length; i++) {
        const field = S.asListSexp(elements[i])
        const fieldElements = field.elements
        if (fieldElements.length !== 2) {
          throw new Error("struct field must have two elements: name and value")
        }
        const fieldName = S.asSymbolSexp(fieldElements[0]).content
        if (fields[fieldName] !== undefined) {
          throw new Error(`duplicate struct field: ${fieldName}`)
        }
        fields[fieldName] = parseData(fieldElements[1])
      }
      return B.StructData(name, fields)
    }
    case "pointer": {
      const target = parseData(elements[1])
      return B.PointerData(target)
    }
    case "array": {
      const expElements = elements.slice(1).map(parseData)
      return B.ArrayData(expElements)
    }
    default: {
      throw new Error(`[parseData] unknown data form: ${S.formatSexp(sexp)}`)
    }
  }
}
