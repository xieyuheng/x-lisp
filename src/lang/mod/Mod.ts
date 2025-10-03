import { meaning, type Definition } from "../definition/index.ts"
import { type Value } from "../value/index.ts"

export type Mod = {
  url: URL
  claimed: Map<string, Value>
  defined: Map<string, Definition>
  exported: Set<string>
}

export function createMod(url: URL): Mod {
  return {
    url,
    claimed: new Map(),
    defined: new Map(),
    exported: new Set(),
  }
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.defined.keys())
}

export function modLookupValue(mod: Mod, name: string): Value | undefined {
  const definition = mod.defined.get(name)
  if (definition === undefined) {
    return undefined
  }

  return meaning(mod, definition)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.defined.get(name)
  if (defined) return defined

  return undefined
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
  for (const [name, definition] of mod.defined.entries()) {
    if (mod.exported.has(name)) {
      definitions.set(name, definition)
    }
  }

  return definitions
}
