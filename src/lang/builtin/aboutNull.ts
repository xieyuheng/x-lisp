import { define, definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutNull(mod: Mod) {
  provide(mod, ["null", "null?"])

  define(mod, "null", Values.Null())

  definePrimitiveFunction(mod, "null?", 1, (value) => {
    return Values.Bool(Values.isNull(value))
  })
}
