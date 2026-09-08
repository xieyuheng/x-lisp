import { type Definition } from "../definition/index.ts"
import { type Type } from "../type/index.ts"

export type Program = {
  definitions: Map<string, Definition>
  claims: Map<string, Type>
}

export function createProgram(): Program {
  return {
    definitions: new Map(),
    claims: new Map(),
  }
}

export function programLookupDefinition(
  program: Program,
  name: string,
): Definition | undefined {
  return program.definitions.get(name)
}

export function programLookupClaim(
  program: Program,
  name: string,
): Type | undefined {
  return program.claims.get(name)
}
