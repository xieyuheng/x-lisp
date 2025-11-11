import { type Definition } from "../definition/index.ts"

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

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modDefinitionEntries(mod: Mod): Array<[string, Definition]> {
  const entries: Array<[string, Definition]> = []
  for (const [name, definition] of mod.definitions.entries()) {
    entries.push([name, definition])
  }

  return entries
}
