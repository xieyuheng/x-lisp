import { formatValue } from "../format/index.ts"
import { type Hash, type HashEntry } from "./Hash.ts"
import { type Value } from "./index.ts"

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
