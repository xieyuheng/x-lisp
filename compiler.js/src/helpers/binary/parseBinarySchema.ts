import type { BinarySchema } from "./BinarySchema.ts"
import * as Schemas from "./BinarySchema.ts"
import type { SchemaType } from "./SchemaType.ts"

export type SchemaSyntax =
  | Array<SchemaSyntax>
  | [name: string, type: SchemaType]
  | ((data: any) => SchemaSyntax)

export function parseBinarySchema(syntax: SchemaSyntax): BinarySchema {
  if (syntax instanceof Array) {
    if (syntax.length === 2 && typeof syntax[0] === "string") {
      return Schemas.AttributeSchema(syntax[0], syntax[1] as any)
    } else {
      return Schemas.SequenceSchema((syntax as any).map(parseBinarySchema))
    }
  } else {
    return Schemas.DependentSchema((data) => {
      return parseBinarySchema(syntax(data))
    })
  }
}
