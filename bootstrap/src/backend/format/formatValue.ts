import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { formatAtom } from "./formatAtom.ts"

export function formatValues(values: Array<Value>): string {
  return values.map(formatValue).join(" ")
}

export function formatValue(value: Value): string {
  if (Values.isAtom(value)) {
    return formatAtom(value)
  }

  switch (value.kind) {
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
