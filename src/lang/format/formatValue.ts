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

function formatAttributes(
  attributes: Values.Attributes,
  options: Options = {},
): string {
  if (options.digest) {
    return Object.keys(attributes)
      .sort()
      .map((k) => `:${k} ${formatValue(attributes[k], options)}`)
      .join(" ")
  } else {
    return Object.entries(attributes)
      .map(([k, v]) => `:${k} ${formatValue(v, options)}`)
      .join(" ")
  }
}

function formatSetElements(
  elements: Array<Value>,
  options: Options = {},
): string {
  if (options.digest) {
    return elements
      .map((element) => formatValue(element, options))
      .sort()
      .join(" ")
  } else {
    return elements.map((element) => formatValue(element, options)).join(" ")
  }
}

function formatHashEntries(
  entries: Array<Values.HashEntry>,
  options: Options = {},
): string {
  if (options.digest) {
    return entries
      .map((entry) => {
        const k = formatValue(entry.key, options)
        const v = formatValue(entry.value, options)
        return `${k} ${v}`
      })
      .sort()
      .join(" ")
  } else {
    return entries
      .map((entry) => {
        const k = formatValue(entry.key, options)
        const v = formatValue(entry.value, options)
        return `${k} ${v}`
      })
      .join(" ")
  }
}

export function formatValue(value: Value, options: Options = {}): string {
  if (options.digest) {
    value = Values.lazyWalk(value)
  }

  if (isAtom(value)) {
    return formatAtom(value)
  }

  switch (value.kind) {
    case "Tael": {
      const elements = formatValues(value.elements, options)
      const attributes = formatAttributes(value.attributes, options)
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

    case "Set": {
      const elements = formatSetElements(value.elements, options)
      return `{${elements}}`
    }

    case "Hash": {
      const entries = formatHashEntries(Values.hashEntries(value), options)
      if (entries === "") {
        return `(@hash)`
      } else {
        return `(@hash ${entries})`
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
      if (argSchemas === "") {
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
      if (args === "") {
        return `${target}`
      } else {
        return `(${target} ${args})`
      }
    }

    case "Tau": {
      const elementSchemas = formatValues(value.elementSchemas, options)
      const attributeSchemas = formatAttributes(value.attributeSchemas, options)
      if (elementSchemas === "" && attributeSchemas === "") {
        return `(tau)`
      } else if (attributeSchemas === "") {
        return `(tau ${elementSchemas})`
      } else if (elementSchemas === "") {
        return `(tau ${attributeSchemas})`
      } else {
        return `(tau ${elementSchemas} ${attributeSchemas})`
      }
    }

    case "Pattern": {
      return `(@pattern ${formatPattern(value.pattern, options)})`
    }
  }
}
