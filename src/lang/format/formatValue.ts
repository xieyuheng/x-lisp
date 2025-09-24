import {
  formatAtom,
  formatBody,
  formatExp,
  formatPattern,
} from "../format/index.ts"
import * as Values from "../value/index.ts"
import { isAtom, type Value } from "../value/index.ts"

type Options = { digest?: boolean }

export function formatValues(
  values: Array<Value>,
  options: Options = {},
): string {
  return values.map((v) => formatValue(v, options)).join(" ")
}

export function formatAttributes(
  attributes: Values.Attributes,
  options: Options = {},
): string {
  return Object.entries(attributes)
    .map(([k, v]) => `:${k} ${formatValue(v, options)}`)
    .join(" ")
}

export function formatValue(value: Value, options: Options = {}): string {
  if (isAtom(value)) {
    return formatAtom(value)
  }

  switch (value.kind) {
    case "Tael": {
      const elements = formatValues(value.elements, options)
      const attributes = formatAttributes(value.attributes, options)
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

    case "Set": {
      const elements = formatValues(value.elements, options)
      if (elements.length === 0) {
        return `{}`
      } else {
        return `{${elements}}`
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
        const cachedValue = formatValue(value.cachedValue, options)
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
      const argSchemas = formatValues(value.argSchemas, options)
      const retSchema = formatValue(value.retSchema, options)
      if (argSchemas.length === 0) {
        return `(-> ${retSchema})`
      } else {
        return `(-> ${argSchemas} ${retSchema})`
      }
    }

    case "The": {
      const schemaString = formatValue(value.schema, options)
      const valueString = formatValue(value.value, options)
      return `(the ${schemaString} ${valueString})`
    }

    case "Curried": {
      const target = formatValue(value.target, options)
      const args = formatValues(value.args, options)
      if (args.length === 0) {
        return `${target}`
      } else {
        return `(${target} ${args})`
      }
    }

    case "Tau": {
      const elementSchemas = formatValues(value.elementSchemas, options)
      const attributeSchemas = formatAttributes(value.attributeSchemas, options)
      if (elementSchemas.length === 0 && attributeSchemas.length === 0) {
        return `(tau)`
      } else if (attributeSchemas.length === 0) {
        return `(tau ${elementSchemas})`
      } else if (elementSchemas.length === 0) {
        return `(tau ${attributeSchemas})`
      } else {
        return `(tau ${elementSchemas} ${attributeSchemas})`
      }
    }

    case "Pattern": {
      return `(@pattern ${formatPattern(value.pattern)})`
    }
  }
}
