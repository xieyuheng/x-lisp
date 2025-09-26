import { setAdd } from "./setUtils.ts"
import { type Value } from "./Value.ts"

export type SetEntry = {
  digest: string
  element: Value
}

export type Set = {
  kind: "Set"
  entries: Map<string, SetEntry>
}

export function Set(elements: Array<Value>): Set {
  const set: Set = {
    kind: "Set",
    entries: new Map(),
  }

  for (const element of elements) {
    setAdd(set, element)
  }

  return set
}
