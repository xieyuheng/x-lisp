import { equal, same } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutValue(mod: Mod): void {
  definePrimFn(mod, "same?", 2, (x, y) => Values.Bool(same(x, y)))
  definePrimFn(mod, "equal?", 2, (x, y) => Values.Bool(equal(x, y)))
}
