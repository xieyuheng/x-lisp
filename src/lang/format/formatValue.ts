import { formatAtom, formatExp } from "../format/index.ts"
import { isAtom, lambdaIsDefined, type Value } from "../value/index.ts"

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
      if (args.length === 0) {
        return `${lambda}`
      } else {
        return `(${lambda} ${args.join(" ")})`
      }
    }

    case "PrimFn": {
      return `${value.name}`
    }

    case "CurriedPrimFn": {
      const args = value.args.map(formatValue)
      if (args.length === 0) {
        return `${value.primFn.name}`
      } else {
        return `(${value.primFn.name} ${args.join(" ")})`
      }
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
      if (args.length === 0) {
        return `${formatValue(value.predicate)}`
      } else {
        return `(${formatValue(value.predicate)} ${args.join(" ")})`
      }
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

    case "Arrow": {
      const argSchemas = value.argSchemas.map(formatValue)
      const retSchema = formatValue(value.retSchema)
      return `(-> ${argSchemas.join(" ")} ${retSchema})`
    }

    case "Claimed": {
      return `(the ${formatValue(value.schema)} ${formatValue(value.value)})`
    }
  }
}
