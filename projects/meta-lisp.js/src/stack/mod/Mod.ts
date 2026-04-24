import { type Definition } from "../definition/index.ts"

export type Mod = {
  definitions: Map<string, Definition>
}

export function createMod(): Mod {
  return {
    definitions: new Map(),
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}
