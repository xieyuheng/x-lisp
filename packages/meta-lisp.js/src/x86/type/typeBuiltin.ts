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
}
