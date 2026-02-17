import { define, definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinNull(mod: Mod) {
  provide(mod, ["null", "null?"])

  define(mod, "null", Values.NullValue())

  definePrimitiveFunction(mod, "null?", 1, (value) => {
    return Values.BoolValue(Values.isNullValue(value))
  })
}
