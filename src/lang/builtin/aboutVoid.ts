import {
  definePrimitiveFunction,
  defineValue,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutVoid(mod: Mod) {
  provide(mod, ["void", "void?"])

  defineValue(mod, "void", Values.Void())

  definePrimitiveFunction(mod, "void?", 1, (value) => {
    return Values.Bool(Values.isVoid(value))
  })
}
