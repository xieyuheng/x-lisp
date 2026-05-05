import * as S from "../index.ts"

export function formatSexp(sexp: S.Sexp): string {
  switch (sexp.kind) {
    case "Symbol": {
      return sexp.content
    }

    case "Keyword": {
      return `:${sexp.content}`
    }

    case "String": {
      return JSON.stringify(sexp.content)
    }

    case "Int": {
      return sexp.content.toString()
    }

    case "Float": {
      if (Number.isInteger(sexp.content)) {
        return `${sexp.content.toString()}.0`
      } else {
        return sexp.content.toString()
      }
    }

    case "List": {
      const elements = sexp.elements.map(formatSexp)

      if (elements.length === 0) {
        return `()`
      } else {
        return `(${elements.join(" ")})`
      }
    }
  }
}
