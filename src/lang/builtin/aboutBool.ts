import { define, definePrimitiveFunction, provide } from "../define/index.ts"
import { runCode } from "../load/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutBool(mod: Mod) {
  provide(mod, ["true", "false", "bool?", "not"])

  define(mod, "true", Values.Bool(true))

  define(mod, "false", Values.Bool(false))

  definePrimitiveFunction(mod, "bool?", 1, (value) => {
    return Values.Bool(Values.isBool(value))
  })

  runCode(mod, `(claim not (-> bool? bool?))`)
  definePrimitiveFunction(mod, "not", 1, (value) => {
    return Values.Bool(Values.isFalse(value))
  })
}
