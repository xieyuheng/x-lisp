import { definePrimitiveFunction, provide } from "../define/index.ts"
import { apply } from "../evaluate/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFunction(mod: Mod) {
  provide(mod, ["apply"])

  definePrimitiveFunction(mod, "apply", 2, (f, args) => {
    return apply(f, Values.asTael(args).elements)
  })
}
