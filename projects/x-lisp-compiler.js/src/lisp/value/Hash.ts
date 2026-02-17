import { type Value } from "./Value.ts"

export type HashEntry = {
  hashKey: string
  key: Value
  value: Value
}

export type HashValue = {
  kind: "Hash"
  entries: Map<string, HashEntry>
}

export function HashValue(): HashValue {
  return {
    kind: "Hash",
    entries: new Map(),
  }
}
