import type { MetadataDefinition } from "../definition/Definition.ts"
import type { Definition } from "../definition/index.ts"
import { registerBuiltinTypeConstructors } from "../type/typeBuiltin.ts"

export type ValueRelocation = {
  name: string
  className: string
  arg: string
}

export type Mod = {
  definitions: Map<string, Definition>
  metadataDefinitions: Map<string, MetadataDefinition>
  valueRelocations: Map<string, ValueRelocation>
}

export function createMod(): Mod {
  const mod: Mod = {
    definitions: new Map(),
    metadataDefinitions: new Map(),
    valueRelocations: new Map(),
  }
  registerBuiltinTypeConstructors(mod)
  return mod
}

export function modDefine(mod: Mod, definition: Definition): void {
  switch (definition.kind) {
    case "MetadataDefinition": {
      mod.metadataDefinitions.set(definition.target, definition)
      return
    }
    default: {
      mod.definitions.set(definition.name, definition)
      return
    }
  }
}

export function modLookupDefinition(
  mod: Mod,
  name: string,
): Definition | undefined {
  return mod.definitions.get(name)
}

export function modLookupMetadata(
  mod: Mod,
  target: string,
): MetadataDefinition | undefined {
  return mod.metadataDefinitions.get(target)
}
