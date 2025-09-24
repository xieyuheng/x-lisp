import { formatValue } from "../format/index.ts"
import { type Pattern } from "../pattern/index.ts"
import * as Values from "../value/index.ts"

export function formatPattern(pattern: Pattern): string {
  switch (pattern.kind) {
    case "VarPattern": {
      return pattern.name
    }

    case "TaelPattern": {
      const elements = pattern.elements.map(formatPattern)
      const attributes = Object.entries(pattern.attributes).map(
        ([k, v]) => `:${k} ${formatPattern(v)}`,
      )
      if (elements.length === 0 && attributes.length === 0) {
        return `[]`
      } else if (attributes.length === 0) {
        return `[${elements.join(" ")}]`
      } else if (elements.length === 0) {
        return `[${attributes.join(" ")}]`
      } else {
        return `[${elements.join(" ")} ${attributes.join(" ")}]`
      }
    }

    case "LiteralPattern": {
      if (Values.isAtom(pattern.value) || Values.isNull(pattern.value)) {
        return formatValue(pattern.value)
      }

      return `(@escape ${formatValue(pattern.value)})`
    }

    case "ConsStarPattern": {
      const elements = pattern.elements.map(formatPattern)
      return `(cons* ${elements.join(" ")} ${formatPattern(pattern.rest)})`
    }
  }
}
