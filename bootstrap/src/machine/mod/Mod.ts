import { type Definition } from "../definition/index.ts"

export type Mod = {
  url: URL
  exported: Set<string>
  definitions: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    exported: new Set(),
    definitions: new Map(),
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modDefinitions(mod: Mod): Array<Definition> {
  return Array.from(mod.definitions.values())
}
