import { type Type } from "./Type.ts"

export function typeBytes(
  type: Type,
  structSizes?: Map<string, number>,
): number {
  switch (type.kind) {
    case "AtomType": {
      return atomTypeBytes(type.name)
    }

    case "PointerType": {
      return 8
    }

    case "NamedType": {
      if (!structSizes) {
        let message = `Cannot compute bytes for named type without structSizes: ${type.name}`
        throw new Error(message)
      }

      const size = structSizes.get(type.name)
      if (size === undefined) {
        let message = `Unknown struct type: ${type.name}`
        throw new Error(message)
      }
      return size
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
