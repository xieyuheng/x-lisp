import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinConsole(mod: Mod) {
  provide(mod, [
    "print",
    "println-non-void",
    // "write",
    "newline",
  ])

  definePrimitiveFunction(mod, "print", 1)
  definePrimitiveFunction(mod, "println-non-void", 1)
  // definePrimitiveFunction(mod, "write", 1, )
  definePrimitiveFunction(mod, "newline", 0)
}
