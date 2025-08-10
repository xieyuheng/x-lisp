import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

export type Definition = {
  origin: Mod
  name: string
  value: Value
}

export type Mod = {
  url: URL
  defined: Map<string, Definition>
  claimed: Map<string, Definition>
  code: string
  stmts: Array<Stmt>
}

export function createMod(url: URL): Mod {
  return {
    url,
    defined: new Map(),
    claimed: new Map(),
    code: "",
    stmts: [],
  }
}

export function modLookup(mod: Mod, name: string): Value | undefined {
  const definition = mod.defined.get(name)
  if (definition === undefined) return undefined

  return definition.value
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

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.defined.keys())
}
