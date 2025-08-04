import { type Mod } from "../mod/index.ts"
import { same } from "../same/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutValue(mod: Mod): void {
  definePrimFn(mod, "same?", 2, (x, y) => Values.Bool(same(x, y)))
}
