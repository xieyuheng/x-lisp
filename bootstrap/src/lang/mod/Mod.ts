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

export function logMod(tag: string, mod: Mod): Mod {
  console.log(`;;; ${tag}`)
  console.log()
  console.log(prettyMod(60, mod))
  console.log()
  return mod
}
