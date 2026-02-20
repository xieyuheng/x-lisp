import * as S from "@xieyuheng/sexp.js"
import { type Definition } from "../definition/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

export type Mod = {
  url: URL
  stmts: Array<Stmt>
  exported: Set<string>
  claimed: Map<string, Value>
  definitions: Map<string, Definition>
  dependencies: Map<string, Mod>
}

export function createMod(url: URL, dependencies: Map<string, Mod>): Mod {
  return {
    url,
    stmts: [],
    exported: new Set(),
    claimed: new Map(),
    definitions: new Map(),
    dependencies,
  }
}

export function modDefine(
  mod: Mod,
  name: string,
  definition: Definition,
): void {
  if (mod.definitions.has(name)) {
    let message = `[modDefine] can not redefine`
    message += `\n  name: ${name}`
    if (definition.meta) throw new S.ErrorWithMeta(message, definition.meta)
    else throw new Error(message)
  }

  mod.definitions.set(name, definition)
}

export function modClaim(
  mod: Mod,
  name: string,
  type: Value,
): void {
  if (mod.claimed.has(name)) {
    let message = `[modClaim] can not reclaim`
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  mod.claimed.set(name, type)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modLookupPublicDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  if (!mod.exported.has(name)) return undefined
  return modLookupDefinition(mod, name)
}

export function modPublicDefinitionEntries(
  mod: Mod,
): Array<[string, Definition]> {
  const entries: Array<[string, Definition]> = []
  for (const [name, definition] of mod.definitions.entries()) {
    if (mod.exported.has(name)) {
      entries.push([name, definition])
    }
  }

  return entries
}

export function modOwnDefinitions(mod: Mod): Array<Definition> {
  return Array.from(
    mod.definitions.values().filter((definition) => definition.mod === mod),
  )
}
