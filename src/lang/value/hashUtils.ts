import { formatValue } from "../format/index.ts"
import { type Hash, type HashEntry } from "./Hash.ts"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function isHash(value: Value): value is Hash {
  return value.kind === "Hash"
}

export function asHash(value: Value): Hash {
  if (isHash(value)) return value
  throw new Error(`[asHash] fail on: ${formatValue(value)}\n`)
}

export function hashEntries(hash: Hash): Array<HashEntry> {
  return Array.from(hash.entries.values())
}

export function hashGet(hash: Hash, key: Value): Value | undefined {
  const hashKey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashKey)
  if (entry === undefined) {
    return undefined
  } else {
    return entry.value
  }
}

export function hashPut(hash: Hash, key: Value, value: Value): void {
  const hashKey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashKey)
  if (entry === undefined) {
    hash.entries.set(hashKey, { hashKey, key, value })
  } else {
    entry.value = value
  }
}

export function isHashable(value: Value): boolean {
  if (Values.isAtom(value)) return true

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
