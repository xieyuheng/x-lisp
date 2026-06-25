import type { TypeConstructor } from "./TypeConstructor.ts"

export type Type = DataType

export type DataType = {
  kind: "DataType"
  typeConstructor: TypeConstructor
}

export function DataType(typeConstructor: TypeConstructor): DataType {
  return {
    kind: "DataType",
    typeConstructor,
  }
}
