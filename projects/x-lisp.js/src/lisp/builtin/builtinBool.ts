import {
  definePrimitiveFunction,
  definePrimitiveVariable,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinBool(mod: Mod) {
  provide(mod, ["true", "false", "bool?", "not"])

  definePrimitiveVariable(mod, "true", Values.BoolValue(true))

  definePrimitiveVariable(mod, "false", Values.BoolValue(false))

  definePrimitiveFunction(mod, "bool?", 1, (value) => {
    return Values.BoolValue(Values.isBoolValue(value))
  })

  definePrimitiveFunction(mod, "not", 1, (value) => {
    return Values.BoolValue(Values.isFalseValue(value))
  })
}
