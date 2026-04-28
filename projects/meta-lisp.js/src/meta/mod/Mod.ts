import * as S from "@xieyuheng/sexp.js"
import { type DataConstructor, type Definition } from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import * as M from "../index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type Value } from "../value/index.ts"

export type ClaimedEntry = {
  exp: Exp
  type?: Value
}

export type Mod = {
  name: string
  stmts: Array<Stmt>
  exempted: Set<string>
  definitions: Map<string, Definition>
  claimed: Map<string, ClaimedEntry>
  inferredTypes: Map<string, Value>
  dataConstructors: Map<string, DataConstructor>
  project: M.Project
  isTypeErrorModule?: boolean
}

export function createMod(name: string, project: M.Project): Mod {
  return {
    name,
    stmts: [],
    exempted: new Set(),
    definitions: new Map(),
    claimed: new Map(),
    inferredTypes: new Map(),
    dataConstructors: new Map(),
    project,
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
    if (definition.location)
      throw new S.ErrorWithSourceLocation(message, definition.location)
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

export function modLookupNameByDefinition(
  mod: Mod,
  definition: Definition,
): string | undefined {
  for (const [name, foundDefinition] of mod.definitions.entries()) {
    if (foundDefinition === definition) {
      return name
    }
  }

  return undefined
}

export function modDefinitionEntries(mod: Mod): Array<[string, Definition]> {
  return Array.from(mod.definitions.entries())
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
  callback: (definition: M.Definition) => void,
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

  const type = M.evaluate(mod, M.emptyEnv(), claimedEntry.exp)
  claimedEntry.type = type
  return type
}

export function modLookupClaimedEntry(
  mod: Mod,
  name: string,
): ClaimedEntry | undefined {
  return mod.claimed.get(name)
}

export function modForEachClaimEntry(
  mod: Mod,
  callback: (entry: ClaimedEntry) => void,
): void {
  for (const entry of mod.claimed.values()) {
    callback(entry)
  }
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
  mod: M.Mod,
  name: string,
): M.DataConstructor | undefined {
  const definition = M.modLookupDefinition(mod, name)
  if (definition) {
    return M.definitionToDataConstructor(definition)
  }

  const builtinMod = M.loadBuiltinMod(mod.project)
  const builtinDefinition = M.modLookupDefinition(builtinMod, name)
  if (builtinDefinition) {
    return M.definitionToDataConstructor(builtinDefinition)
  }

  return undefined
}
