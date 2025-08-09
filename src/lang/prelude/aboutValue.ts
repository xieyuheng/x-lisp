import { definePrimFn } from "../define/index.ts"
import { equal, same } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutValue(mod: Mod) {
  definePrimFn(mod, "same?", 2, (x, y) => Values.Bool(same(x, y)))
  definePrimFn(mod, "equal?", 2, (x, y) => Values.Bool(equal(x, y)))
  definePrimFn(mod, "atom?", 1, (x) => Values.Bool(Values.isAtom(x)))
  definePrimFn(mod, "anything?", 1, (x) => Values.Bool(true))
}
