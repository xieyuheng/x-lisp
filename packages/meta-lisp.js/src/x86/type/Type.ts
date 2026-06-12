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
