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

export type Mod = {
  url: URL
  text?: string
  defs: Map<string, Def>
  stmts: Array<Stmt>
  isFinished?: boolean
}

export function createMod(url: URL): Mod {
  return {
    url,
    defs: new Map(),
    stmts: [],
  }
}

export function modSet(mod: Mod, name: string, def: Def): void {
  mod.defs.set(name, def)
}

export function modGet(mod: Mod, name: string): Def | undefined {
  return mod.defs.get(name)
}

export function modGetValue(mod: Mod, name: string): Value | undefined {
  const def = modGet(mod, name)
  if (def === undefined) return undefined

  if (def.value.kind === "Lambda" && def.value.definedName === undefined) {
    def.value.definedName = def.name
  }

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
