import {
  formatAtom,
  formatBody,
  formatExp,
  formatPattern,
} from "../format/index.ts"
import { isAtom, type Value } from "../value/index.ts"

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

    case "Set": {
      const elements = value.elements.map(formatValue)
      if (elements.length === 0) {
        return `{}`
      } else {
        return `{${elements.join(" ")}}`
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

    case "DataPutter": {
      return `put-${value.constructor.name}-${value.fieldName}!`
    }

    case "Arrow": {
      const argSchemas = value.argSchemas.map(formatValue)
      const retSchema = formatValue(value.retSchema)
      if (argSchemas.length === 0) {
        return `(-> ${retSchema})`
      } else {
        return `(-> ${argSchemas.join(" ")} ${retSchema})`
      }
    }

    case "The": {
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

    case "Tau": {
      const elementSchemas = value.elementSchemas.map(formatValue)
      const attributeSchemas = Object.entries(value.attributeSchemas).map(
        ([k, v]) => `:${k} ${formatValue(v)}`,
      )
      if (elementSchemas.length === 0 && attributeSchemas.length === 0) {
        return `(tau)`
      } else if (attributeSchemas.length === 0) {
        return `(tau ${elementSchemas.join(" ")})`
      } else if (elementSchemas.length === 0) {
        return `(tau ${attributeSchemas.join(" ")})`
      } else {
        return `(tau ${elementSchemas.join(" ")} ${attributeSchemas.join(" ")})`
      }
    }

    case "Pattern": {
      return `(@pattern ${formatPattern(value.pattern)})`
    }
  }
}
