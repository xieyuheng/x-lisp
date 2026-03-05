import {
  definePrimitiveFunction,
  definePrimitiveVariable,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinVoid(mod: Mod) {
  provide(mod, ["void", "void?"])

  definePrimitiveVariable(mod, "void", Values.VoidValue())

  definePrimitiveFunction(mod, "void?", 1, (value) => {
    return Values.BoolValue(Values.isVoidValue(value))
  })
}
