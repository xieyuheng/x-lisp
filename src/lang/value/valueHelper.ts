import { type Meta, type Value } from "./Value.ts"

export function valueMaybeMeta(value: Value): Meta | undefined {
  switch (value.kind) {
    case "Lambda":
    case "NullaryLambda": {
      return value.meta
    }

    default: {
      return undefined
    }
  }
}
