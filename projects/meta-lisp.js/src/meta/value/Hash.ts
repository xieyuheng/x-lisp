import { formatValue } from "../format/index.ts"
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

export function isHashValue(value: Value): value is HashValue {
  return value.kind === "HashValue"
}

export function asHashValue(value: Value): HashValue {
  if (isHashValue(value)) return value
  throw new Error(`[asHashValue] fail on: ${formatValue(value)}`)
}
