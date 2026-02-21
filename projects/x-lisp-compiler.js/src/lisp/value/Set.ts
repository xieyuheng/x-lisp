import { setAdd } from "./setHelper.ts"
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
