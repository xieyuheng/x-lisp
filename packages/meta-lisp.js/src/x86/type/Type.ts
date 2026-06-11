export type Type = AtomType | PointerType | NamedType

export type AtomType = {
  kind: "AtomType"
  name: string
}

export function AtomType(name: string): AtomType {
  return {
    kind: "AtomType",
    name,
  }
}

export type PointerType = {
  kind: "PointerType"
  target: Type
}

export function PointerType(target: Type): PointerType {
  return {
    kind: "PointerType",
    target,
  }
}

export type NamedType = {
  kind: "NamedType"
  name: string
}

export function NamedType(name: string): NamedType {
  return {
    kind: "NamedType",
    name,
  }
}

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
        throw new Error(
          `Cannot compute bytes for named type without structSizes: ${type.name}`,
        )
      }
      const size = structSizes.get(type.name)
      if (size === undefined) {
        throw new Error(`Unknown struct type: ${type.name}`)
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
