import type { Definition } from "../definition/index.ts"
import { registerBuiltinTypes } from "../type/typeBuiltin.ts"

export type Program = {
  definitions: Map<string, Definition>
}

export function createProgram(): Program {
  const program: Program = {
    definitions: new Map(),
  }
  registerBuiltinTypes(program)
  return program
}

export function programDefine(program: Program, definition: Definition): void {
  program.definitions.set(definition.name, definition)
}

export function programLookupDefinition(
  program: Program,
  name: string,
): Definition | undefined {
  return program.definitions.get(name)
}
