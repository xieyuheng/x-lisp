import type { MetadataDefinition } from "../definition/Definition.ts"
import type { Definition } from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import type { Type, TypeConstructor } from "../type/index.ts"
import { registerBuiltinTypeConstructors } from "../type/typeBuiltin.ts"

export type Mod = {
  definitions: Map<string, Definition>
  claimedTypeExps: Map<string, Exp>
  claimedTypes: Map<string, Type>
  codeMetadataTypeExp: Exp | undefined
  codeMetadataType: Type | undefined
  metadataDefinitions: Map<string, MetadataDefinition>
  typeConstructors: Map<string, TypeConstructor>
}

export function createMod(): Mod {
  const mod: Mod = {
    definitions: new Map(),
    claimedTypeExps: new Map(),
    claimedTypes: new Map(),
    codeMetadataTypeExp: undefined,
    codeMetadataType: undefined,
    metadataDefinitions: new Map(),
    typeConstructors: new Map(),
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

export function modLookupClaimedType(mod: Mod, name: string): Type | undefined {
  return mod.claimedTypes.get(name)
}
