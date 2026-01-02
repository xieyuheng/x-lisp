import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinValue(mod: Mod) {
  provide(mod, [
    "identity",
    "same?",
    "equal?",
    // "atom?",
    "any?",
  ])

  definePrimitiveFunction(mod, "identity", 1)
  definePrimitiveFunction(mod, "same?", 2)
  definePrimitiveFunction(mod, "equal?", 2)
  // definePrimitiveFunction(mod, "atom?", 1)
  definePrimitiveFunction(mod, "any?", 1)
}
