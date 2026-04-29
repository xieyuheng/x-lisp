import assert from "node:assert"
import * as M from "../index.ts"

type Options = { digest?: boolean }

export function formatValues(
  values: Array<M.Value>,
  options: Options = {},
): string {
  return values.map((v) => formatValue(v, options)).join(" ")
}

function formatAttributes(
  attributes: Record<string, M.Value>,
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
  elements: Array<M.Value>,
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
  entries: Array<M.HashEntry>,
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

export function formatValue(value: M.Value, options: Options = {}): string {
  switch (value.kind) {
    case "BoolValue": {
      if (value.content) {
        return "true"
      } else {
        return "false"
      }
    }

    case "VoidValue": {
      return "void"
    }

    case "KeywordValue": {
      return `:${value.content}`
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

    case "ListValue": {
      const elements = formatValues(value.elements, options)
      if (elements === "") {
        return `[]`
      } else {
        return `[${elements}]`
      }
    }

    case "RecordValue": {
      const attributes = formatAttributes(value.attributes, options)
      if (attributes === "") {
        return `{}`
      } else {
        return `{${attributes}}`
      }
    }

    case "SetValue": {
      const elements = formatSetElements(M.setElements(value), options)
      return `{${elements}}`
    }

    case "HashValue": {
      const entries = formatHashEntries(M.hashEntries(value), options)
      if (entries === "") {
        return `(@hash)`
      } else {
        return `(@hash ${entries})`
      }
    }

    case "ClosureValue": {
      return `(lambda (${value.parameters.join(" ")}) ${M.formatBody(value.body)})`
    }

    case "CurryValue": {
      const target = formatValue(value.target, options)
      const args = formatValues(value.args, options)
      assert(value.args.length > 0)
      return `(${target} ${args})`
    }

    case "DefinitionValue": {
      return `${value.definition.name}`
    }

    case "FileValue": {
      if (value.file.path) {
        return `#(file ${value.file.fd} "${value.file.path}")`
      } else {
        return `#(file ${value.file.fd})`
      }
    }
  }
}
