import { type Definition } from "../definition/index.ts"

export type Mod = {
  url: URL
  defined: Map<string, Definition>
}

export function createMod(url: URL): Mod {
  return {
    url,
    defined: new Map(),
  }
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.defined.keys())
}
