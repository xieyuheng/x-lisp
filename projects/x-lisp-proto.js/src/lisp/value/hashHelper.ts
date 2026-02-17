import { formatValue } from "../format/index.ts"
import { type HashEntry, type HashValue } from "./Hash.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isHashValue(value: Value): value is HashValue {
  return value.kind === "Hash"
}

export function asHashValue(value: Value): HashValue {
  if (isHashValue(value)) return value
  throw new Error(`[asHash] fail on: ${formatValue(value)}`)
}

export function hashEntries(hash: HashValue): Array<HashEntry> {
  return Array.from(hash.entries.values())
}

export function hashLength(hash: HashValue): number {
  return Array.from(hash.entries.values()).length
}

export function hashGet(hash: HashValue, key: Value): Value | undefined {
  const hashKey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashKey)
  if (entry === undefined) {
    return undefined
  } else {
    return entry.value
  }
}

export function hashPut(hash: HashValue, key: Value, value: Value): void {
  const hashKey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashKey)
  if (entry === undefined) {
    hash.entries.set(hashKey, { hashKey, key, value })
  } else {
    entry.value = value
  }
}

export function hashDelete(hash: HashValue, key: Value): void {
  const hashKey = formatValue(key, { digest: true })
  hash.entries.delete(hashKey)
}

export function isHashable(value: Value): boolean {
  if (Values.isAtomValue(value)) return true

  if (value.kind === "Tael") {
    return (
      value.elements.every(isHashable) &&
      Object.values(value.attributes).every(isHashable)
    )
  }

  if (value.kind === "Set") {
    return Values.setElements(value).every(isHashable)
  }

  if (value.kind === "Hash") {
    return Values.hashEntries(value).every((entry) => isHashable(entry.value))
  }

  return false
}
