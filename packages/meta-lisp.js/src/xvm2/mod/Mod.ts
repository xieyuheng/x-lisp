import { type Definition } from "../definition/index.ts"

export type Mod = {
  definitions: Map<string, Definition>
  entry: string | undefined
}

export function createMod(): Mod {
  return {
    definitions: new Map(),
    entry: undefined,
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}
