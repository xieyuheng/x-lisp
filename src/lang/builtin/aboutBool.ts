import {
  definePrimitiveFunction,
  defineValue,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutBool(mod: Mod) {
  provide(mod, ["true", "false", "bool?", "not"])

  defineValue(mod, "true", Values.Bool(true))

  defineValue(mod, "false", Values.Bool(false))

  definePrimitiveFunction(mod, "bool?", 1, (value) => {
    return Values.Bool(Values.isBool(value))
  })

  definePrimitiveFunction(mod, "not", 1, (value) => {
    return Values.Bool(Values.isFalse(value))
  })
}
