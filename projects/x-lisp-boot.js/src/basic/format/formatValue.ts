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
      if (value.attributes.isPrimitive) {
        return `(@primitive-function ${value.name} ${value.arity})`
      } else {
        return `(@function ${value.name} ${value.arity})`
      }
    }

    case "Address": {
      if (value.attributes.isPrimitive) {
        return `(@primitive-address ${value.name})`
      } else {
        return `(@address ${value.name})`
      }
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
