import { definePrimitiveFunction } from "../define/index.ts"
import { equal } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutValue(mod: Mod) {
  definePrimitiveFunction(mod, "identity", 1, (value) => {
    return value
  })

  definePrimitiveFunction(mod, "equal?", 2, (x, y) => {
    return Values.Bool(equal(x, y))
  })
}
