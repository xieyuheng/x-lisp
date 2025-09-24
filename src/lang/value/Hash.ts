import { type Value } from "./Value.ts"

export type HashEntry = {
  hash: string
  key: Value
  value: Value
}

export type Hash = {
  kind: "Hash"
  entries: Map<string, HashEntry>
}

export function Hash(): Hash {
  return {
    kind: "Hash",
    entries: new Map(),
  }
}
