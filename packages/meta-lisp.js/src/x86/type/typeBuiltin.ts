import type { Mod } from "../mod/index.ts"
import type { TypeConstructor } from "./TypeConstructor.ts"

export function registerBuiltinTypeConstructors(mod: Mod): void {
  const pointerTC: TypeConstructor = {
    mod,
    name: "pointer-t",
    parameters: ["T"],
    size: () => 8,
  }
  mod.typeConstructors.set("pointer-t", pointerTC)

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
    mod.typeConstructors.set(atom.name, {
      mod,
      name: atom.name,
      parameters: [],
      size: () => atom.size,
    })
  }
}
