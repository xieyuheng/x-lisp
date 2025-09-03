import { setUnionMany } from "../../utils/set/setAlgebra.ts"
import { type Value } from "../value/index.ts"

export type Definition = {
  origin: Mod
  name: string
  value: Value
  isPrivate?: boolean
}

export type Mod = {
  url: URL
  claimed: Map<string, Definition>
  defined: Map<string, Definition>
  exported: Set<string>
  imported: Map<string, Definition>
  included: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    claimed: new Map(),
    defined: new Map(),
    exported: new Set(),
    imported: new Map(),
    included: new Map(),
  }
}

export function modNames(mod: Mod): Set<string> {
  return setUnionMany([
    new Set(mod.defined.keys()),
    new Set(mod.imported.keys()),
    new Set(mod.included.keys()),
  ])
}

export function modLookupValue(mod: Mod, name: string): Value | undefined {
  const defined = mod.defined.get(name)
  if (defined) return defined.value

  const imported = mod.imported.get(name)
  if (imported) return imported.value

  const included = mod.included.get(name)
  if (included) return included.value

  return undefined
}

export function modLookupPublicDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.defined.get(name)
  if (defined && !defined.isPrivate) return defined

  const included = mod.included.get(name)
  if (included) return included

  return undefined
}

export function modPublicDefinitions(mod: Mod): Map<string, Definition> {
  const definitions: Map<string, Definition> = new Map()
  for (const [name, definition] of mod.defined.entries()) {
    if (!definition.isPrivate) {
      definitions.set(name, definition)
    }
  }

  for (const [name, definition] of mod.included.entries()) {
    if (!definition.isPrivate) {
      definitions.set(name, definition)
    }
  }

  return definitions
}
