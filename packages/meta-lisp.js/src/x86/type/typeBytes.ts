import { type Type } from "./Type.ts"

export function typeBytes(type: Type): number {
  switch (type.kind) {
    case "AtomType": {
      return atomTypeBytes(type.name)
    }

    case "PointerType": {
      return 8
    }

    case "NamedType": {
      const definition = type.mod.definitions.get(type.name)
      if (definition === undefined || definition.kind !== "StructDefinition") {
        let message = `Unknown struct type: ${type.name}`
        throw new Error(message)
      }

      let total = 0
      for (const [, fieldType] of definition.fields) {
        total += typeBytes(fieldType)
      }
      return total
    }
  }
}

function atomTypeBytes(name: string): number {
  switch (name) {
    case "int8":
    case "uint8":
      return 1
    case "int16":
    case "uint16":
      return 2
    case "int32":
    case "uint32":
      return 4
    case "int64":
    case "uint64":
      return 8
    case "string":
      return 8
    default:
      throw new Error(`Unknown atom type: ${name}`)
  }
}
