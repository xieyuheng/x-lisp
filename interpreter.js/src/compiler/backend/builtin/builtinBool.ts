import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinBool(mod: Mod) {
  definePrimitiveFunction(mod, "not", 1, (value) => {
    return Values.Bool(Values.isFalse(value))
  })
}
