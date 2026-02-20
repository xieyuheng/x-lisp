import assert from "node:assert"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { formatBody } from "./index.ts"

type Options = { digest?: boolean }

export function formatValues(
  values: Array<Value>,
  options: Options = {},
): string {
  return values.map((v) => formatValue(v, options)).join(" ")
}

function formatAttributes(
  attributes: Record<string, Value>,
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
    case "HashtagValue": {
      return `#${value.content}`
    }

    case "SymbolValue": {
      return `'${value.content}`
    }

    case "StringValue": {
      return JSON.stringify(value.content)
    }

    case "IntValue": {
      return value.content.toString()
    }

    case "FloatValue": {
      if (Number.isInteger(value.content)) {
        return `${value.content.toString()}.0`
      } else {
        return value.content.toString()
      }
    }

    case "TaelValue": {
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

    case "SetValue": {
      const elements = formatSetElements(Values.setElements(value), options)
      return `{${elements}}`
    }

    case "HashValue": {
      const entries = formatHashEntries(Values.hashEntries(value), options)
      if (entries === "") {
        return `(@hash)`
      } else {
        return `(@hash ${entries})`
      }
    }

    case "ClosureValue": {
      return `(lambda (${value.parameters.join(" ")}) ${formatBody(value.body)})`
    }

    case "FunctionValue": {
      return `${value.definition.name}`
    }

    case "PrimitiveFunctionValue": {
      return `${value.definition.name}`
    }

    case "DatatypeConstructorValue": {
      return `${value.definition.name}`
    }

    case "CurryValue": {
      const target = formatValue(value.target, options)
      const args = formatValues(value.args, options)
      assert(value.args.length > 0)
      return `(${target} ${args})`
    }

    case "DatatypeValue": {
      const args = formatValues(value.args, options)
      return `(${value.definition.name} ${args})`
    }

    case "DisjointUnionValue": {
      const types = Object.entries(value.types)
        .map(([key, value]) => `:${key} ${formatValue(value)}`)
        .join(" ")
      return `[#disjoint-union ${types}]`
    }
  }
}
