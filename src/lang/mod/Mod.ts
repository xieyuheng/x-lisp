import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

// `Mod` stores values indirectly via `Def`,
// which can be used to distinguish
// imported names from own defined names.

export type Def = {
  mod: Mod
  name: string
  value: Value
}

export type Claim = {
  name: string
  value: Value
}

export type Mod = {
  url: URL
  defs: Map<string, Def>
  claims: Map<string, Claim>
  code: string
  stmts: Array<Stmt>
}

export function createMod(url: URL): Mod {
  return {
    url,
    defs: new Map(),
    claims: new Map(),
    code: "",
    stmts: [],
  }
}

export function modGetValue(mod: Mod, name: string): Value | undefined {
  const def = mod.defs.get(name)
  if (def === undefined) return undefined

  return def.value
}

export function modOwnDefs(mod: Mod): Array<Def> {
  const ownDefs: Array<Def> = []
  for (const def of mod.defs.values()) {
    if (def.mod.url.href === mod.url.href) {
      ownDefs.push(def)
    }
  }

  return ownDefs
}

export function modNames(mod: Mod): Set<string> {
  return new Set(mod.defs.keys())
}

export function modOwnNames(mod: Mod): Set<string> {
  const ownNames = new Set<string>()
  for (const [name, def] of mod.defs.entries()) {
    if (def.mod.url.href === mod.url.href) {
      ownNames.add(name)
    }
  }

  return ownNames
}
