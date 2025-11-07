import { mapMapValue } from "../../../helpers/map/mapMapValue.ts"
import { type Definition } from "../definition/index.ts"
import { prettyMod } from "../pretty/index.ts"

export type Mod = {
  url: URL
  definitions: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    definitions: new Map(),
  }
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.definitions.keys())
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.definitions.get(name)
  if (defined) return defined

  return undefined
}

export function modMapDefinition(
  mod: Mod,
  f: (definition: Definition) => Definition,
): Mod {
  const newMod = createMod(mod.url)
  newMod.definitions = mapMapValue(mod.definitions, f)
  return newMod
}

export type DefinitionEntry = [string, Definition]

export function modFlatMapDefinitionEntry(
  mod: Mod,
  f: (entry: DefinitionEntry) => Array<DefinitionEntry>,
): Mod {
  const newMod = createMod(mod.url)
  for (const entry of mod.definitions.entries()) {
    for (const [name, definition] of f(entry)) {
      newMod.definitions.set(name, definition)
    }
  }

  return newMod
}

export function logMod(tag: string, mod: Mod): Mod {
  console.log(`;;; ${tag}`)
  console.log()
  console.log(prettyMod(60, mod))
  console.log()
  return mod
}
