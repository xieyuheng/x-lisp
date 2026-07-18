import type { Definition } from "../definition/index.ts"
import { registerBuiltinTypes } from "../type/typeBuiltin.ts"

export type Mod = {
  definitions: Map<string, Definition>
}

export function createMod(): Mod {
  const mod: Mod = {
    definitions: new Map(),
  }
  registerBuiltinTypes(mod)
  return mod
}

export function modDefine(mod: Mod, definition: Definition): void {
  mod.definitions.set(definition.name, definition)
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}
