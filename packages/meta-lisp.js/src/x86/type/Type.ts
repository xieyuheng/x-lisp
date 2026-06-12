import type { TypeConstructor } from "./TypeConstructor.ts"

export type Type = VarType | DataType

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
