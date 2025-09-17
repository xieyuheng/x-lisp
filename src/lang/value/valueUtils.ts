import { equal } from "../equal/index.ts"
import { type Meta, type Value } from "./Value.ts"

export function valueMaybeMeta(value: Value): Meta | undefined {
  switch (value.kind) {
    case "Lambda":
    case "LambdaLazy":
    case "Thunk": {
      return value.meta
    }

    default: {
      return undefined
    }
  }
}

export function valueArrayDedup(values: Array<Value>): Array<Value> {
  const dedupedValues: Array<Value> = []
  for (const value of values) {
    if (!dedupedValues.some((occurred) => equal(value, occurred))) {
      dedupedValues.push(value)
    }
  }

  return dedupedValues
}
