import { definePrimitiveFunction } from "../define/index.ts"
import { equal, same } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutValue(mod: Mod) {
  definePrimitiveFunction(mod, "same?", 2, (x, y) => Values.Bool(same(x, y)))
  definePrimitiveFunction(mod, "equal?", 2, (x, y) => Values.Bool(equal(x, y)))
  definePrimitiveFunction(mod, "atom?", 1, (x) => Values.Bool(Values.isAtom(x)))
  definePrimitiveFunction(mod, "sexp?", 1, (x) => Values.Bool(Values.isSexp(x)))
  definePrimitiveFunction(mod, "anything?", 1, (x) => Values.Bool(true))
}
