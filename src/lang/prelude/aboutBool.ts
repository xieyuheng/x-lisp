import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutBool(mod: Mod): void {
  definePrimFn(mod, "not", 1, (x) => Values.Bool(!Values.asBool(x).content))
}
