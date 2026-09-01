import { type Definition } from "../definition/index.ts"

export type Program = {
  definitions: Map<string, Definition>
}

export function createProgram(): Program {
  return {
    definitions: new Map(),
  }
}

export function programLookupDefinition(
  program: Program,
  name: string,
): Definition | undefined {
  return program.definitions.get(name)
}
