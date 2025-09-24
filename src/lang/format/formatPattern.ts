import { formatValue } from "../format/index.ts"
import { type Pattern } from "../pattern/index.ts"
import * as Values from "../value/index.ts"

type Options = { digest?: boolean }

export function formatPatterns(
  patterns: Array<Pattern>,
  options: Options = {},
): string {
  return patterns.map((pattern) => formatPattern(pattern, options)).join(" ")
}

export function formatPatternAttributes(
  attributes: Record<string, Pattern>,
  options: Options = {},
): string {
  return Object.entries(attributes)
    .map(([k, v]) => `:${k} ${formatPattern(v, options)}`)
    .join(" ")
}

export function formatPattern(pattern: Pattern, options: Options = {}): string {
  switch (pattern.kind) {
    case "VarPattern": {
      return pattern.name
    }

    case "TaelPattern": {
      const elements = formatPatterns(pattern.elements, options)
      const attributes = formatPatternAttributes(pattern.attributes, options)
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
        return formatValue(pattern.value, options)
      }

      return `(@escape ${formatValue(pattern.value, options)})`
    }

    case "ConsStarPattern": {
      const elements = formatPatterns(pattern.elements, options)
      return `(cons* ${elements} ${formatPattern(pattern.rest, options)})`
    }
  }
}
