import { define, definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutBool(mod: Mod): void {
  definePrimFn(mod, "bool?", 1, (x) => Values.Bool(Values.isBool(x)))

  define(mod, "true", Values.Bool(true))
  define(mod, "false", Values.Bool(false))
  definePrimFn(mod, "not", 1, (x) => Values.Bool(!Values.asBool(x).content))
}
