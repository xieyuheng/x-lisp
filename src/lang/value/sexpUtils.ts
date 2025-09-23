import { formatValue } from "../format/index.ts"
import { isAtom } from "./atomUtils.ts"
import type { Value } from "./Value.ts"

export function isSexp(value: Value): boolean {
  if (isAtom(value)) return true

  if (value.kind === "Tael") {
    return (
      value.elements.every(isSexp) &&
      Object.values(value.attributes).every(isSexp)
    )
  }

  return false
}

export function formatSexp(value: Value): string {
  switch (value.kind) {
    case "Hashtag": {
      return `#${value.content}`
    }

    case "Symbol": {
      return `${value.content}`
    }

    case "String": {
      return JSON.stringify(value.content)
    }

    case "Int": {
      return value.content.toString()
    }

    case "Float": {
      if (Number.isInteger(value.content)) {
        return `${value.content.toString()}.0`
      } else {
        return value.content.toString()
      }
    }

    case "Tael": {
      const elements = value.elements.map(formatSexp)
      const attributes = Object.entries(value.attributes).map(
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

    default: {
      let message = `[formatSexp] expect value to be sexp\n`
      message += `  value: ${formatValue(value)}`
      throw new Error(message)
    }
  }
}
