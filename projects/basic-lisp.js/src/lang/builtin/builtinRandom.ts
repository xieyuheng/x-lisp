import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinRandom(mod: Mod) {
  provide(mod, [
    "random-dice",
    // "random-int",
    // "random-float"
  ])

  definePrimitiveFunction(mod, "random-dice", 0)
  // definePrimitiveFunction(mod, "random-int", 2)
  // definePrimitiveFunction(mod, "random-float", 2)
}
