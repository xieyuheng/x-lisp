import { type Definition } from "../definition/index.ts"

export type Program = {
  definitions: Map<string, Definition>
  entry: string | undefined
}

export function createProgram(): Program {
  return {
    definitions: new Map(),
    entry: undefined,
  }
}

export function programLookupDefinition(
  program: Program,
  name: string,
): Definition | undefined {
  return program.definitions.get(name)
}
