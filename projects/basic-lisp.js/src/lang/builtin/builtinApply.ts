import { definePrimitiveFunctionWithContext, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinApply(mod: Mod) {
  provide(mod, ["apply-nullary", "apply-unary"])

  definePrimitiveFunctionWithContext(
    mod,
    "apply-nullary",
    1,
    (context) => (f) => {
      throw new Error()
    },
  )

  definePrimitiveFunctionWithContext(
    mod,
    "apply-unary",
    2,
    (context) => (f, arg) => {
      throw new Error()
    },
  )
}
