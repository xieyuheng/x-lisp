import { definePrimitiveFunctionWithContext, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFunction(mod: Mod) {
  provide(mod, ["make-function"])

  definePrimitiveFunctionWithContext(mod, "make-function", 2)
}
