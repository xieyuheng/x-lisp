import type { Definition } from "../definition/index.ts"

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

export function modLookup(mod: Mod, name: string): Definition | undefined {
  return mod.definitions.get(name)
}
