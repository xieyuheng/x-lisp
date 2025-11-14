import { definePrimitiveFunctionWithContext, provide } from "../define/index.ts"
import { apply, applyNullary } from "../execute/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFunction(mod: Mod) {
  provide(mod, ["apply-nullary", "apply-unary"])

  definePrimitiveFunctionWithContext(
    mod,
    "apply-nullary",
    1,
    (context) => (f) => {
      return applyNullary(context, f)
    },
  )

  definePrimitiveFunctionWithContext(
    mod,
    "apply-unary",
    2,
    (context) => (f, arg) => {
      return apply(context, f, arg)
    },
  )
}
