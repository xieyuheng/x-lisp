import { formatAtom, formatExp } from "../format/index.ts"
import {
  isAtom,
  lambdaIsDefined,
  lazyActiveDeep,
  type Value,
} from "../value/index.ts"

export function formatValue(value: Value): string {
  if (isAtom(value)) {
    return formatAtom(value)
  }

  switch (value.kind) {
    case "Tael": {
      const elements = value.elements.map(formatValue)
      const attributes = Object.entries(value.attributes).map(
        ([k, v]) => `:${k} ${formatValue(v)}`,
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

    case "Lambda": {
      if (lambdaIsDefined(value)) {
        return value.definedName
      }

      return `(lambda (${value.name}) ${formatExp(value.ret)})`
    }

    case "Lazy": {
      return `${formatValue(lazyActiveDeep(value))}`
    }
  }
}
