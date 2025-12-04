import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinApply(mod: Mod) {
  provide(mod, ["apply-nullary", "apply-unary"])

  definePrimitiveFunction(mod, "apply-nullary", 1)
  definePrimitiveFunction(mod, "apply-unary", 2)
}
