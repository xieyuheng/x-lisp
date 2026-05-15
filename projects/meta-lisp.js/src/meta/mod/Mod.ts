import * as S from "@xieyuheng/sexp.js"
import { type DataConstructor, type Definition } from "../definition/index.ts"
import { type Exp } from "../exp/index.ts"
import * as M from "../index.ts"
import { type Stmt } from "../stmt/index.ts"

export type ClaimedEntry = {
  exp: Exp
  type?: M.Type
}

export type Mod = {
  name: string
  stmts: Array<Stmt>
  admitted: Set<string>
  definitions: Map<string, Definition>
  claimed: Map<string, ClaimedEntry>
  opaqueClaimed: Map<string, M.Exp>
  inferredTypes: Map<string, M.Type>
  dataConstructors: Map<string, DataConstructor>
  project: M.Project
  isErrorModule?: boolean
}

export function createMod(name: string, project: M.Project): Mod {
  return {
    name,
    stmts: [],
    admitted: new Set(),
    definitions: new Map(),
    claimed: new Map(),
    opaqueClaimed: new Map(),
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

export function modNameIsAsDefined(mod: Mod, name: string): boolean {
  const definition = mod.definitions.get(name)
  return definition !== undefined && definition.name === name
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
): M.Type | undefined {
  const claimedEntry = mod.claimed.get(name)
  if (!claimedEntry) return undefined
  if (claimedEntry.type) return claimedEntry.type

  const type = M.typeEvaluate("OpaqueMode", mod, M.emptyTypeEnv(), claimedEntry.exp)
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
): M.Type | undefined {
  return mod.inferredTypes.get(name)
}

export function modPutInferredType(mod: Mod, name: string, type: M.Type): void {
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

  return undefined
}
