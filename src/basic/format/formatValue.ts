import type { Value } from "../value/index.ts"

export function formatValues(values: Array<Value>): string {
  return values.map(formatValue).join(" ")
}

export function formatValue(value: Value): string {
  switch (value.kind) {
    case "Bool": {
      return value.content ? "#t" : "#f"
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
  }
}
