import { type Definition } from "../definition/index.ts"
import { prettyMod } from "../pretty/index.ts"

export type Mod = {
  url: URL
  exported: Set<string>
  definitions: Map<string, Definition>
  dependencies: Map<string, Mod>
}

export function createMod(url: URL): Mod {
  return {
    url,
    exported: new Set(),
    definitions: new Map(),
    dependencies: new Map(),
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.definitions.get(name)
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

export function modPublicDefinitionEntries(
  mod: Mod,
): Array<[string, Definition]> {
  const entries: Array<[string, Definition]> = []
  for (const [name, definition] of mod.definitions.entries()) {
    if (mod.exported.has(name)) {
      entries.push([name, definition])
    }
  }

  return entries
}

export function modOwnDefinitions(mod: Mod): Array<Definition> {
  return Array.from(
    mod.definitions.values().filter((definition) => definition.mod === mod),
  )
}

export function logMod(tag: string, mod: Mod): Mod {
  console.log(`;;; ${tag}`)
  console.log()
  console.log(prettyMod(60, mod))
  console.log()
  return mod
}
