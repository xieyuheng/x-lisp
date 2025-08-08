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

      return `(lambda (${value.parameters.join(" ")}) ${formatExp(value.body)})`
    }

    case "CurriedLambda": {
      const lambda = formatValue(value.lambda)
      const args = value.args.map(formatValue)
      return `(${lambda} ${args.join(" ")})`
    }

    case "Lazy": {
      return `${formatValue(lazyActiveDeep(value))}`
    }

    case "PrimFn": {
      return `${value.name}`
    }

    case "CurriedPrimFn": {
      const args = value.args.map(formatValue)
      return `(${value.primFn.name} ${args.join(" ")})`
    }

    case "Void": {
      return "#void"
    }

    case "Data": {
      if (value.elements.length === 0) {
        return value.constructor.name
      } else {
        const elements = value.elements.map(formatValue)
        return `(${value.constructor.name} ${elements.join(" ")})`
      }
    }

    case "DataPredicate": {
      return value.name
    }

    case "CurriedDataPredicate": {
      const args = value.args.map(formatValue)
      return `(${formatValue(value.predicate)} ${args.join(" ")})`
    }

    case "DataConstructor": {
      return value.name
    }

    case "DataConstructorPredicate": {
      return `${value.constructor.name}?`
    }

    case "DataGetter": {
      return `${value.constructor.name}-${value.fieldName}`
    }
  }
}
