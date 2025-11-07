import { meaning, type Definition } from "../definition/index.ts"
import { type Value } from "../value/index.ts"

export type Mod = {
  url: URL
  exported: Set<string>
  claimed: Map<string, Value>
  definitions: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    exported: new Set(),
    claimed: new Map(),
    definitions: new Map(),
  }
}

export function modLookupValue(mod: Mod, name: string): Value | undefined {
  const definition = mod.definitions.get(name)
  if (definition === undefined) {
    return undefined
  }

  return meaning(mod, definition)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modLookupPublicDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  if (!mod.exported.has(name)) return undefined
  return modLookupDefinition(mod, name)
}

export function modPublicDefinitions(mod: Mod): Map<string, Definition> {
  const definitions: Map<string, Definition> = new Map()
  for (const [name, definition] of mod.definitions.entries()) {
    if (mod.exported.has(name)) {
      definitions.set(name, definition)
    }
  }

  return definitions
}
