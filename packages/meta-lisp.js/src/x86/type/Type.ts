import type { TypeConstructor } from "./TypeConstructor.ts"

export type Type = AtomType | VarType | DataType

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

export type VarType = {
  kind: "VarType"
  name: string
}

export function VarType(name: string): VarType {
  return {
    kind: "VarType",
    name,
  }
}

export type DataType = {
  kind: "DataType"
  typeConstructor: TypeConstructor
  argTypes: Type[]
}

export function DataType(
  typeConstructor: TypeConstructor,
  argTypes: Type[],
): DataType {
  return {
    kind: "DataType",
    typeConstructor,
    argTypes,
  }
}
