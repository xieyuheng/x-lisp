import { formatValue } from "../format/index.ts"
import { type Value } from "./Value.ts"
import * as Values from "./index.ts"

export type HashValue = {
  kind: "HashValue"
  entries: Map<string, HashValueEntry>
}

export type HashValueEntry = {
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

export function hashValueEntries(hash: HashValue): Array<HashValueEntry> {
  return Array.from(hash.entries.values())
}

export function hashValueLength(hash: HashValue): number {
  return Array.from(hash.entries.values()).length
}

export function hashValueGet(hash: HashValue, key: Value): Value | undefined {
  const hashKey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashKey)
  if (entry === undefined) {
    return undefined
  } else {
    return entry.value
  }
}

export function hashValuePut(hash: HashValue, key: Value, value: Value): void {
  const hashKey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashKey)
  if (entry === undefined) {
    hash.entries.set(hashKey, { hashKey, key, value })
  } else {
    entry.value = value
  }
}

export function hashValueDelete(hash: HashValue, key: Value): void {
  const hashKey = formatValue(key, { digest: true })
  hash.entries.delete(hashKey)
}

export function isHashable(value: Value): boolean {
  if (Values.isAtomValue(value)) return true

  if (value.kind === "ListValue") {
    return value.elements.every(isHashable)
  }

  if (value.kind === "RecordValue") {
    return Object.values(value.attributes).every(isHashable)
  }

  if (value.kind === "SetValue") {
    return Values.setValueElements(value).every(isHashable)
  }

  if (value.kind === "HashValue") {
    return Values.hashValueEntries(value).every((entry) =>
      isHashable(entry.value),
    )
  }

  return false
}
