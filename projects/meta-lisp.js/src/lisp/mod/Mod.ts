import * as S from "@xieyuheng/sexp.js"
import Path from "node:path"
import { type DataConstructor, type Definition } from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import * as L from "../index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

export type ClaimedEntry = {
  exp: Exp
  type?: Value
}

export type Mod = {
  path: string
  stmts: Array<Stmt>
  exported: Set<string>
  exempted: Set<string>
  definitions: Map<string, Definition>
  claimed: Map<string, ClaimedEntry>
  inferredTypes: Map<string, Value>
  dataConstructors: Map<string, DataConstructor>
  dependencyGraph: L.DependencyGraph
}

export function createMod(
  path: string,
  dependencyGraph: L.DependencyGraph,
): Mod {
  return {
    path: Path.resolve(path),
    stmts: [],
    exported: new Set(),
    exempted: new Set(),
    definitions: new Map(),
    claimed: new Map(),
    inferredTypes: new Map(),
    dataConstructors: new Map(),
    dependencyGraph,
  }
}

// Definition

export function modDefine(
  mod: Mod,
  name: string,
  definition: Definition,
): void {
  if (mod.definitions.has(name)) {
    let message = `[modDefine] name already defined`
    message += `\n  name: ${name}`
    if (definition.meta) throw new S.ErrorWithMeta(message, definition.meta)
    else throw new Error(message)
  }

  mod.definitions.set(name, definition)
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

export function modNameIsAsDefined(mod: Mod, name: string): boolean {
  const definition = mod.definitions.get(name)
  return definition !== undefined && definition.name === name
}

export function modForEachOwnDefinition(
  mod: Mod,
  callback: (Definition: L.Definition) => void,
): void {
  for (const definition of mod.definitions.values()) {
    if (definition.mod === mod) {
      callback(definition)
    }
  }
}

// Claimed

export function modClaim(mod: Mod, name: string, exp: Exp): void {
  if (mod.claimed.has(name)) {
    let message = `[modClaim] name already claimed`
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

// Inferred

export function modLookupInferredType(
  mod: Mod,
  name: string,
): Value | undefined {
  return mod.inferredTypes.get(name)
}

export function modPutInferredType(mod: Mod, name: string, type: Value): void {
  if (mod.inferredTypes.has(name)) {
    let message = `[modPutInferredType] name already inferred`
    message += `\n  name: ${name}`
    throw new Error(message)
  }

  mod.inferredTypes.set(name, type)
}

// DataConstructor

export function modLookupDataConstructor(
  mod: L.Mod,
  name: string,
): L.DataConstructor | undefined {
  const definition = L.modLookupDefinition(mod, name)
  return definition && L.definitionToDataConstructor(definition)
}
