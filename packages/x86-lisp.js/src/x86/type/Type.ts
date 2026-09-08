export type Type = NamedType | ArrayType

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

export type ArrayType = {
  kind: "ArrayType"
  element: Type
  length: number
}

export function ArrayType(element: Type, length: number): ArrayType {
  return {
    kind: "ArrayType",
    element,
    length,
  }
}
