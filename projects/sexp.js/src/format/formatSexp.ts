import * as S from "../index.ts"

export function formatSexp(sexp: S.Sexp): string {
  switch (sexp.kind) {
    case "SymbolSexp": {
      return sexp.content
    }

    case "KeywordSexp": {
      return `:${sexp.content}`
    }

    case "StringSexp": {
      return JSON.stringify(sexp.content)
    }

    case "IntSexp": {
      return sexp.content.toString()
    }

    case "FloatSexp": {
      if (Number.isInteger(sexp.content)) {
        return `${sexp.content.toString()}.0`
      } else {
        return sexp.content.toString()
      }
    }

    case "ListSexp": {
      const elements = sexp.elements.map(formatSexp)

      if (elements.length === 0) {
        return `()`
      } else {
        return `(${elements.join(" ")})`
      }
    }
  }
}
