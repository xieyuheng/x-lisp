import * as L from "../index.ts"

export function setupClaim(mod: L.Mod): void {
  for (const key of mod.claimed.keys()) {
    L.modLookupClaimedType(mod, key)
  }
}
