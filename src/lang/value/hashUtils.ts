import { formatValue } from "../format/index.ts"
import { type Hash, type HashEntry } from "./Hash.ts"
import { type Value } from "./index.ts"

export function hashEntries(hash: Hash): Array<HashEntry> {
  return Array.from(hash.entries.values())
}

export function hashGet(hash: Hash, key: Value): Value | undefined {
  const hashkey = formatValue(key, { digest: true })
  const entry = hash.entries.get(hashkey)
  if (entry === undefined) {
    return undefined
  }

  return entry.value
}
