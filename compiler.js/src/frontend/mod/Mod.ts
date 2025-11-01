import { mapMapValue } from "../../helpers/map/mapMapValue.ts"
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

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.defined.get(name)
  if (defined) return defined

  return undefined
}

export function modMapDefinition(
  mod: Mod,
  f: (definition: Definition) => Definition,
): Mod {
  const newMod = createMod(mod.url)
  newMod.defined = mapMapValue(mod.defined, f)
  return newMod
}
