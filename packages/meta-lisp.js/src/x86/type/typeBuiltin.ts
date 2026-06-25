import * as S from "@xieyuheng/sexp.js"
import { PrimitiveTypeDefinition } from "../definition/Definition.ts"
import type { Mod } from "../mod/index.ts"
import type { TypeConstructor } from "./TypeConstructor.ts"

export function registerBuiltinTypeConstructors(mod: Mod): void {
  const builtinLocation = S.zeroLocation("<builtin>")

  const pointerTC: TypeConstructor = {
    mod,
    name: "pointer-t",
    size: () => 8,
  }
  mod.definitions.set(
    "pointer-t",
    PrimitiveTypeDefinition("pointer-t", pointerTC, builtinLocation),
  )

  const atomTypeConstructors: Array<{
    name: string
    size: number
  }> = [
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

  for (const atom of atomTypeConstructors) {
    const tc: TypeConstructor = {
      mod,
      name: atom.name,
      size: () => atom.size,
    }
    mod.definitions.set(
      atom.name,
      PrimitiveTypeDefinition(atom.name, tc, builtinLocation),
    )
  }
}
