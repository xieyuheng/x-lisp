import type { BinarySchema } from "./BinarySchema.ts"
import * as Schemas from "./BinarySchema.ts"
import type { SchemaType } from "./SchemaType.ts"

export function sequence(schemas: Array<BinarySchema>): Schemas.SequenceSchema {
  return Schemas.SequenceSchema(schemas)
}

export function attribute(
  name: string,
  type: SchemaType,
): Schemas.AttributeSchema {
  return Schemas.AttributeSchema(name, type)
}

export function dependent(
  fn: (data: any) => BinarySchema,
): Schemas.DependentSchema {
  return Schemas.DependentSchema(fn)
}
