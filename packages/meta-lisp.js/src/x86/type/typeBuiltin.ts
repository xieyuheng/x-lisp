import * as S from "@xieyuheng/sexp.js"
import { PrimitiveTypeDefinition } from "../definition/Definition.ts"
import type { Program } from "../program/index.ts"

export function registerBuiltinTypes(program: Program): void {
  const builtinLocation = S.zeroLocation("<builtin>")

  const primitives: Array<{ name: string; size: number }> = [
    { name: "pointer-t", size: 8 },
    { name: "int8-t", size: 1 },
    { name: "int16-t", size: 2 },
    { name: "int32-t", size: 4 },
    { name: "int64-t", size: 8 },
    { name: "uint8-t", size: 1 },
    { name: "uint16-t", size: 2 },
    { name: "uint32-t", size: 4 },
    { name: "uint64-t", size: 8 },
    { name: "string-t", size: 8 },
  ]

  for (const primitive of primitives) {
    program.definitions.set(
      primitive.name,
      PrimitiveTypeDefinition(primitive.name, primitive.size),
    )
  }
}
