import type { Type } from "./Type.ts"

export type BinarySchema = SequenceSchema | AttributeSchema | DependentSchema

export type SequenceSchema = {
  kind: "SequenceSchema"
  schemas: Array<BinarySchema>
}

export function SequenceSchema(schemas: Array<BinarySchema>): SequenceSchema {
  return {
    kind: "SequenceSchema",
    schemas,
  }
}

export type AttributeSchema = {
  kind: "AttributeSchema"
  name: string
  type: Type
}

export function AttributeSchema(name: string, type: Type): AttributeSchema {
  return {
    kind: "AttributeSchema",
    name,
    type,
  }
}

export type DependentSchema = {
  kind: "DependentSchema"
  fn: (data: any) => BinarySchema
}

export function DependentSchema(
  fn: (data: any) => BinarySchema,
): DependentSchema {
  return {
    kind: "DependentSchema",
    fn,
  }
}
