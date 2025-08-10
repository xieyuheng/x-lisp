import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

export type Definition = {
  origin: Mod
  name: string
  value: Value
}

export type Mod = {
  url: URL
  claimed: Map<string, Definition>
  defined: Map<string, Definition>
  imported: Map<string, Definition>
  code: string
  stmts: Array<Stmt>
}

export function createMod(url: URL): Mod {
  return {
    url,
    claimed: new Map(),
    defined: new Map(),
    imported: new Map(),
    code: "",
    stmts: [],
  }
}

export function modLookupValue(mod: Mod, name: string): Value | undefined {
  const defined = mod.defined.get(name)
  if (defined) return defined.value

  const imported = mod.imported.get(name)
  if (imported) return imported.value

  return undefined
}

export function modPublicDefinitions(mod: Mod): Array<Definition> {
  const ownDefinitions: Array<Definition> = []
  for (const definition of mod.defined.values()) {
    if (definition.origin.url.href === mod.url.href) {
      ownDefinitions.push(definition)
    }
  }

  return ownDefinitions
}

export function modLookupPublicDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  const defined = mod.defined.get(name)
  if (defined) return defined

  return undefined
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.defined.keys())
}
