import { formatValue } from "../format/index.ts"
import { type Pattern } from "../pattern/index.ts"
import * as Values from "../value/index.ts"

type Options = { digest?: boolean }

function formatPatterns(
  patterns: Array<Pattern>,
  options: Options = {},
): string {
  return patterns.map((pattern) => formatPattern(pattern, options)).join(" ")
}

function formatPatternAttributes(
  attributes: Record<string, Pattern>,
  options: Options = {},
): string {
  if (options.digest) {
    return Object.keys(attributes)
      .sort()
      .map((k) => `:${k} ${formatPattern(attributes[k], options)}`)
      .join(" ")
  } else {
    return Object.entries(attributes)
      .map(([k, v]) => `:${k} ${formatPattern(v, options)}`)
      .join(" ")
  }
}

export function formatPattern(pattern: Pattern, options: Options = {}): string {
  switch (pattern.kind) {
    case "VarPattern": {
      return pattern.name
    }

    case "TaelPattern": {
      const elements = formatPatterns(pattern.elements, options)
      const attributes = formatPatternAttributes(pattern.attributes, options)
      if (elements === "" && attributes === "") {
        return `[]`
      } else if (attributes === "") {
        return `[${elements}]`
      } else if (elements === "") {
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
