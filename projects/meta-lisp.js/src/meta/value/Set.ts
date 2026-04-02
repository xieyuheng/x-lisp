import { formatValue } from "../format/index.ts"
import { setAdd } from "./setHelpers.ts"
import { type Value } from "./Value.ts"

export type SetValue = {
  kind: "SetValue"
  entries: Map<string, SetEntry>
}

export type SetEntry = {
  hashKey: string
  element: Value
}

export function SetValue(elements: Array<Value>): SetValue {
  const set: SetValue = {
    kind: "SetValue",
    entries: new Map(),
  }

  for (const element of elements) {
    setAdd(set, element)
  }

  return set
}


export function isSetValue(value: Value): value is SetValue {
  return value.kind === "SetValue"
}

export function asSetValue(value: Value): SetValue {
  if (isSetValue(value)) return value
  throw new Error(`[asSetValue] fail on: ${formatValue(value)}`)
}
