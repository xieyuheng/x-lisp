import { formatValue } from "../format/index.ts"
import { type Pattern } from "../pattern/index.ts"
import * as Values from "../value/index.ts"

type Options = { digest?: boolean }

export function formatPatterns(patterns: Array<Pattern>): string {
  return patterns.map((pattern) => formatPattern(pattern)).join(" ")
}

export function formatPatternAttributes(
  attributes: Record<string, Pattern>,
): string {
  return Object.entries(attributes)
    .map(([k, v]) => `:${k} ${formatPattern(v)}`)
    .join(" ")
}

export function formatPattern(pattern: Pattern): string {
  switch (pattern.kind) {
    case "VarPattern": {
      return pattern.name
    }

    case "TaelPattern": {
      const elements = formatPatterns(pattern.elements)
      const attributes = formatPatternAttributes(pattern.attributes)
      if (elements.length === 0 && attributes.length === 0) {
        return `[]`
      } else if (attributes.length === 0) {
        return `[${elements}]`
      } else if (elements.length === 0) {
        return `[${attributes}]`
      } else {
        return `[${elements} ${attributes}]`
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
