import * as Values from "./index.ts"

export function hashEntries(hash: Values.Hash): Array<Values.HashEntry> {
  return Array.from(hash.entries.values())
}
