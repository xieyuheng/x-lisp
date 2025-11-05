import { type Value } from "../value/index.ts"

export function formatValues(values: Array<Value>): string {
  return values.map(formatValue).join(" ")
}

export function formatValue(value: Value): string {
  switch (value.kind) {
    case "Hashtag": {
      return `#${value.content}`
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

    case "FunctionRef": {
      return `(@function ${value.name} ${value.arity})`
    }

    case "Curry": {
      const target = formatValue(value.target)
      const args = formatValues(value.args)
      if (args === "") {
        return `(@curry ${target} ${value.arity})`
      } else {
        return `(@curry ${target} ${value.arity} ${args})`
      }
    }
  }
}
