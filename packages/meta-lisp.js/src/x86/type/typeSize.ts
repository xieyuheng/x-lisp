import * as X86 from "../index.ts"

export function typeSize(mod: X86.Mod, type: X86.Type): number {
  const definition = X86.modLookupDefinition(mod, type.name)
  if (definition === undefined) {
    throw new Error(`[typeSize] unknown type: ${type.name}`)
  }

  if (definition.kind === "PrimitiveTypeDefinition") {
    return definition.size
  }

  if (definition.kind === "StructDefinition") {
    let total = 0
    for (const field of definition.fields) {
      total += typeSize(mod, X86.evaluateType(mod, X86.emptyEnv(), field.exp))
    }
    return total
  }

  throw new Error(`[typeSize] not a type: ${type.name}`)
}
