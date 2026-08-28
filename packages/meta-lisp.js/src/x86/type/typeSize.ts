import * as X86 from "../index.ts"

export function typeSize(program: X86.Program, type: X86.Type): number {
  if (type.kind === "ArrayType") {
    return typeSize(program, type.element) * type.length
  }

  const definition = X86.programLookupDefinition(program, type.name)
  if (definition === undefined) {
    throw new Error(`[typeSize] unknown type: ${type.name}`)
  }

  if (definition.kind === "PrimitiveTypeDefinition") {
    return definition.size
  }

  if (definition.kind === "StructDefinition") {
    let total = 0
    for (const fieldName of Object.keys(definition.fields)) {
      total += typeSize(program, definition.fields[fieldName])
    }
    return total
  }

  throw new Error(`[typeSize] not a type: ${type.name}`)
}
