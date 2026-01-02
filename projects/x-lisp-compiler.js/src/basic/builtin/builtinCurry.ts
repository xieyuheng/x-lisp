import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinCurry(mod: Mod) {
  provide(mod, ["make-curry", "curry-put!"])

  definePrimitiveFunction(mod, "make-curry", 3)
  definePrimitiveFunction(mod, "curry-put!", 3)
}
