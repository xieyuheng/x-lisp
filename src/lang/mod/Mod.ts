import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

// `Mod` stores values indirectly via `Def`,
// which can be used to distinguish
// imported names from own defined names.

export type Definition = {
  origin: Mod
  name: string
  value: Value
}

export type Mod = {
  url: URL
  definitions: Map<string, Definition>
  claims: Map<string, Value>
  code: string
  stmts: Array<Stmt>
}

export function createMod(url: URL): Mod {
  return {
    url,
    definitions: new Map(),
    claims: new Map(),
    code: "",
    stmts: [],
  }
}

export function modLookup(mod: Mod, name: string): Value | undefined {
  const definition = mod.definitions.get(name)
  if (definition === undefined) return undefined

  return definition.value
}

export function modOwnDefinitions(mod: Mod): Array<Definition> {
  const ownDefinitions: Array<Definition> = []
  for (const definition of mod.definitions.values()) {
    if (definition.origin.url.href === mod.url.href) {
      ownDefinitions.push(definition)
    }
  }

  return ownDefinitions
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.definitions.keys())
}
