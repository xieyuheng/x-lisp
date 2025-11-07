import { formatValue } from "../format/index.ts"
import * as Values from "./Value.ts"
import { type Value } from "./Value.ts"

export function List(elements: Array<Value>): Values.Tael {
  return {
    kind: "Tael",
    elements,
    attributes: {},
  }
}

export function Record(attributes: Values.Attributes): Values.Tael {
  return {
    kind: "Tael",
    elements: [],
    attributes,
  }
}

export function asTael(value: Value): Values.Tael {
  if (value.kind === "Tael") return value
  throw new Error(`[asTael] fail on: ${formatValue(value)}`)
}
