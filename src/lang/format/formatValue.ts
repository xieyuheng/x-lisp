import { formatAtom, formatBody, formatExp } from "../format/index.ts"
import { isAtom, type Value } from "../value/index.ts"

export function formatValue(value: Value): string {
  if (isAtom(value)) {
    return formatAtom(value)
  }

  switch (value.kind) {
    case "Null": {
      return "#null"
    }

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
      return `(lambda (${value.parameters.join(" ")}) ${formatBody(value.body)})`
    }

    case "Thunk": {
      return `(thunk ${formatBody(value.body)})`
    }

    case "Lazy": {
      if (value.cachedValue) {
        const cachedValue = formatValue(value.cachedValue)
        return `(lazy ${formatExp(value.exp)} :cached-value ${cachedValue})`
      } else {
        return `(lazy ${formatExp(value.exp)})`
      }
    }

    case "LambdaLazy": {
      return `(lambda-lazy (${value.parameters.join(" ")}) ${formatBody(value.body)})`
    }

    case "PrimitiveFunction": {
      return `${value.name}`
    }

    case "PrimitiveThunk": {
      return `${value.name}`
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

    case "Curried": {
      const target = formatValue(value.target)
      const args = value.args.map(formatValue)
      if (args.length === 0) {
        return `${target}`
      } else {
        return `(${target} ${args.join(" ")})`
      }
    }
  }
}
