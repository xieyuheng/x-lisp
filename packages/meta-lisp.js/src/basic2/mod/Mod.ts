import { type Definition } from "../definition/index.ts"
import { type Type } from "../type/index.ts"

export type Mod = {
  definitions: Map<string, Definition>
  claims: Map<string, Type>
}

export function createMod(): Mod {
  return {
    definitions: new Map(),
    claims: new Map(),
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modLookupClaim(mod: Mod, name: string): Type | undefined {
  return mod.claims.get(name)
}
