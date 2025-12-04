import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFunction(mod: Mod) {
  provide(mod, ["make-function"])

  definePrimitiveFunction(mod, "make-function", 2)
}
