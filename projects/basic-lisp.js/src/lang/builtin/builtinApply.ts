import { definePrimitiveFunctionWithContext, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinApply(mod: Mod) {
  provide(mod, ["apply-nullary", "apply-unary"])

  definePrimitiveFunctionWithContext(mod, "apply-nullary", 1)
  definePrimitiveFunctionWithContext(mod, "apply-unary", 2)
}
