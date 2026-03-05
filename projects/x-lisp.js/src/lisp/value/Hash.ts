import { type Value } from "./Value.ts"

export type HashValue = {
  kind: "HashValue"
  entries: Map<string, HashEntry>
}

export type HashEntry = {
  hashKey: string
  key: Value
  value: Value
}

export function HashValue(): HashValue {
  return {
    kind: "HashValue",
    entries: new Map(),
  }
}
