import * as S from "@xieyuheng/sexp.js"
import * as N from "../index.ts"

export const parseExp: S.Router<N.Exp> = S.createRouter<N.Exp>({
  "(cons* 'struct rest)": ({ rest }, { location }) => {
    const elements = S.asListSexp(rest).elements
    if (elements.length === 0) {
      throw new S.ErrorWithSourceLocation(
        "struct requires at least one field",
        location,
      )
    }
    let name: string | undefined
    let fieldStart: number
    if (elements[0].kind === "SymbolSexp") {
      name = S.asSymbolSexp(elements[0]).content
      fieldStart = 1
    } else {
      fieldStart = 0
    }
    const fields: Array<N.StructField> = []
    for (let i = fieldStart; i < elements.length; i++) {
      const field = S.asListSexp(elements[i])
      const fieldElements = field.elements
      if (fieldElements.length !== 2) {
        throw new S.ErrorWithSourceLocation(
          "struct field must have two elements: name and value",
          field.location,
        )
      }
      const fieldName = S.asSymbolSexp(fieldElements[0]).content
      const fieldExp = parseExp(fieldElements[1])
      fields.push(N.StructField(fieldName, fieldExp))
    }
    return N.StructExp(name, fields, location)
  },

  "`(pointer ,target)": ({ target }, { location }) => {
    return N.PointerExp(parseExp(target), location)
  },

  "(cons* 'label path)": ({ path }, { location }) => {
    const elements = S.asListSexp(path).elements.map(
      (x) => S.asSymbolSexp(x).content,
    )
    return N.LabelExp(elements[0], elements.slice(1), location)
  },

  "(cons* target args)": ({ target, args }, { location }) => {
    return N.ApplyExp(
      parseExp(target),
      S.asListSexp(args).elements.map(parseExp),
      location,
    )
  },

  data: ({ data }, { location }) => {
    switch (data.kind) {
      case "SymbolSexp":
        return N.VarExp(S.asSymbolSexp(data).content, location)
      case "IntSexp":
        return N.IntExp(S.asIntSexp(data).content, location)
      case "StringSexp":
        return N.StringExp(S.asStringSexp(data).content, location)
      default: {
        throw new S.ErrorWithSourceLocation(
          `unexpected exp: ${S.formatSexp(data)}`,
          location,
        )
      }
    }
  },
})
