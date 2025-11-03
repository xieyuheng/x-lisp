import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutBool(mod: Mod) {
  definePrimitiveFunction(mod, "not", 1, (x) => {
    return Values.Bool(!Values.asBool(x).content)
  })
}
