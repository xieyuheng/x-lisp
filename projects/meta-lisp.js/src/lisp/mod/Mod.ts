import * as S from "@xieyuheng/sexp.js"
import { type Definition } from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import * as L from "../index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

export type ClaimedEntry = {
  exp: Exp
  type?: Value
}

export type Mod = {
  url: URL
  stmts: Array<Stmt>
  exported: Set<string>
  exempted: Set<string>
  claimed: Map<string, ClaimedEntry>
  definitions: Map<string, Definition>
  dependencyGraph: L.DependencyGraph
}

export function createMod(url: URL, dependencyGraph: L.DependencyGraph): Mod {
  return {
    url,
    stmts: [],
    exported: new Set(),
    exempted: new Set(),
    claimed: new Map(),
    definitions: new Map(),
    dependencyGraph,
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

export function modClaim(mod: Mod, name: string, exp: Exp): void {
  if (mod.claimed.has(name)) {
    let message = `[modClaim] can not reclaim`
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  mod.claimed.set(name, { exp })
}

export function modLookupClaimedType(
  mod: Mod,
  name: string,
): Value | undefined {
  const claimedEntry = mod.claimed.get(name)
  if (!claimedEntry) return undefined
  if (claimedEntry.type) return claimedEntry.type

  const type = L.evaluate(mod, L.emptyEnv(), claimedEntry.exp)
  claimedEntry.type = type
  return type
}

export function modLookupClaimedEntry(
  mod: Mod,
  name: string,
): ClaimedEntry | undefined {
  return mod.claimed.get(name)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modLookupType(mod: Mod, name: string): Value | undefined {
  const definition = modLookupDefinition(mod, name)
  if (definition === undefined) return undefined

  return modLookupClaimedType(definition.mod, definition.name)
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
