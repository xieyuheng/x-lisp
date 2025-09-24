import { formatValue } from "../format/index.ts"
import { type Pattern } from "../pattern/index.ts"
import * as Values from "../value/index.ts"

type Options = { digest?: boolean }

export function formatPatterns(patterns: Array<Pattern>): string {
  return patterns.map((pattern) => formatPattern(pattern)).join(" ")
}

export function formatPattern(pattern: Pattern): string {
  switch (pattern.kind) {
    case "VarPattern": {
      return pattern.name
    }

    case "TaelPattern": {
      const elements = formatPatterns(pattern.elements)
      const attributes = Object.entries(pattern.attributes).map(
        ([k, v]) => `:${k} ${formatPattern(v)}`,
      )
      if (elements.length === 0 && attributes.length === 0) {
        return `[]`
      } else if (attributes.length === 0) {
        return `[${elements}]`
      } else if (elements.length === 0) {
        return `[${attributes.join(" ")}]`
      } else {
        return `[${elements} ${attributes.join(" ")}]`
      }
    }

    case "LiteralPattern": {
      if (Values.isAtom(pattern.value) || Values.isNull(pattern.value)) {
        return formatValue(pattern.value)
      }

      return `(@escape ${formatValue(pattern.value)})`
    }

    case "ConsStarPattern": {
      const elements = formatPatterns(pattern.elements)
      return `(cons* ${elements} ${formatPattern(pattern.rest)})`
    }
  }
}
