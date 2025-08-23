import { define, definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutNull(mod: Mod) {
  define(mod, "null", Values.Null())

  definePrimitiveFunction(mod, "null?", 1, (value) => {
    return Values.Bool(value.kind === "Null")
  })
}
