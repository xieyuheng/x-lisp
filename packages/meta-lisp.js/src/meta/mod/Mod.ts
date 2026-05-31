import * as S from "@xieyuheng/sexp.js"
import * as M from "../index.ts"

export type ClaimedEntry = {
  exp: M.Term
  type?: M.Type
}

export type DefinitionState = {
  isChecked?: boolean
  hasError?: boolean
}

export type Mod = {
  name: string
  stmts: Array<M.Stmt<M.Exp>>
  admitted: Set<string>
  definitions: Map<string, M.Definition>
  definitionStates: Map<string, DefinitionState>
  claimed: Map<string, ClaimedEntry>
  opaqueClaimed: Map<string, M.Term>
  inferredTypes: Map<string, M.Type>
  dataConstructors: Map<string, M.DataConstructor>
  pkg: M.Package
}

export function createMod(name: string, pkg: M.Package): Mod {
  return {
    name,
    stmts: [],
    admitted: new Set(),
    definitions: new Map(),
    definitionStates: new Map(),
    claimed: new Map(),
    opaqueClaimed: new Map(),
    inferredTypes: new Map(),
    dataConstructors: new Map(),
    pkg,
  }
}

// Definition

export function modDefine(
  mod: Mod,
  name: string,
  definition: M.Definition,
): void {
  if (mod.definitions.has(name)) {
    let message = `[modDefine] name already defined`
    message += `\n  name: ${name}`
    throw new S.ErrorWithSourceLocation(message, definition.location)
  }

  mod.definitions.set(name, definition)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): M.Definition | undefined {
  return mod.definitions.get(name)
}

// DefinitionState

export function modIsChecked(mod: Mod, name: string): boolean {
  return mod.definitionStates.get(name)?.isChecked ?? false
}

export function modSetChecked(mod: Mod, name: string): void {
  const state = mod.definitionStates.get(name) ?? {}
  state.isChecked = true
  mod.definitionStates.set(name, state)
}

export function modSetError(mod: Mod, name: string): void {
  const state = mod.definitionStates.get(name) ?? {}
  state.hasError = true
  mod.definitionStates.set(name, state)
}

export function modHasError(mod: Mod, name: string): boolean {
  return mod.definitionStates.get(name)?.hasError ?? false
}

// Claimed

export function modClaim(mod: Mod, name: string, exp: M.Term): void {
  const previous = mod.claimed.get(name)
  if (previous) {
    let message = `[modClaim] name already claimed`
    message += `\n  name: ${name}`
    if (previous.exp.location) {
      message += `\n`
      message += S.sourceLocationReport(
        previous.exp.location,
        `revious claim`,
      ).trim()
    }
    throw new S.ErrorWithSourceLocation(message, exp.location)
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

  const type = M.evaluateType(mod, M.emptyEnv("OpaqueMode"), claimedEntry.exp)
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
