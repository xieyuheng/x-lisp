import assert from "node:assert"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { formatBody, formatExps } from "./index.ts"

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
  switch (value.kind) {
    case "Hashtag": {
      return `#${value.content}`
    }

    case "Symbol": {
      return `'${value.content}`
    }

    case "String": {
      return JSON.stringify(value.content)
    }

    case "Int": {
      return value.content.toString()
    }

    case "Float": {
      if (Number.isInteger(value.content)) {
        return `${value.content.toString()}.0`
      } else {
        return value.content.toString()
      }
    }

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
      const elements = formatSetElements(Values.setElements(value), options)
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

    case "Closure": {
      return `(lambda (${formatExps(value.parameters)}) ${formatBody(value.body)})`
    }

    case "PrimitiveFunction": {
      return `${value.name}`
    }

    case "Curry": {
      const target = formatValue(value.target, options)
      const args = formatValues(value.args, options)
      assert(value.args.length > 0)
      return `(${target} ${args})`
    }

    case "Datatype": {
      throw new Error("TODO")
    }

    case "DisjointUnion": {
      throw new Error("TODO")
    }
  }
}
