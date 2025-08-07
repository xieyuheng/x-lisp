import { definePrimFn, defineValue } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutBool(mod: Mod): void {
  defineValue(mod, "true", Values.Bool(true))
  defineValue(mod, "false", Values.Bool(false))
  definePrimFn(mod, "not", 1, (x) => Values.Bool(!Values.asBool(x).content))
}
