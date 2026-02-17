import { setAdd } from "./setHelper.ts"
import { type Value } from "./Value.ts"

export type SetEntry = {
  hashKey: string
  element: Value
}

export type SetValue = {
  kind: "Set"
  entries: Map<string, SetEntry>
}

export function SetValue(elements: Array<Value>): SetValue {
  const set: SetValue = {
    kind: "Set",
    entries: new Map(),
  }

  for (const element of elements) {
    setAdd(set, element)
  }

  return set
}
