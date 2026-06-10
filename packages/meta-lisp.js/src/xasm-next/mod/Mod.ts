import type { MetadataDefinition } from "../definition/Definition.ts"
import type { Definition } from "../definition/index.ts"
import type { Type } from "../type/index.ts"

export type Mod = {
  definitions: Map<string, Definition>
  dataTypes: Map<string, Type>
  codeMetadataType: Type | undefined
  metadataOf: Map<string, MetadataDefinition>
}

export function createMod(): Mod {
  return {
    definitions: new Map(),
    dataTypes: new Map(),
    codeMetadataType: undefined,
    metadataOf: new Map(),
  }
}

export function modDefine(mod: Mod, definition: Definition): void {
  switch (definition.kind) {
    case "MetadataDefinition": {
      mod.metadataOf.set(definition.target, definition)
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
  return mod.metadataOf.get(target)
}

export function modSetDataType(mod: Mod, name: string, type: Type): void {
  mod.dataTypes.set(name, type)
}

export function modLookupDataType(mod: Mod, name: string): Type | undefined {
  return mod.dataTypes.get(name)
}

export function modSetCodeMetadataType(mod: Mod, type: Type): void {
  mod.codeMetadataType = type
}
