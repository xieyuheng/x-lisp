import { type Sexp } from "../sexp/index.ts"

export function formatSexp(sexp: Sexp): string {
  switch (sexp.kind) {
    case "Symbol": {
      return sexp.content
    }

    case "Hashtag": {
      return `#${sexp.content}`
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

    case "Tael": {
      const elements = sexp.elements.map(formatSexp)
      const attributes = Object.entries(sexp.attributes).map(
        ([k, e]) => `:${k} ${formatSexp(e)}`,
      )
      if (elements.length === 0 && attributes.length === 0) {
        return `()`
      } else if (attributes.length === 0) {
        return `(${elements.join(" ")})`
      } else if (elements.length === 0) {
        return `(${attributes.join(" ")})`
      } else {
        return `(${elements.join(" ")} ${attributes.join(" ")})`
      }
    }
  }
}
