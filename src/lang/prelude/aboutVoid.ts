import { define, definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutVoid(mod: Mod) {
  define(mod, "void", Values.Void())

  definePrimitiveFunction(mod, "void?", 1, (value) => {
    return Values.Bool(value.kind === "Void")
  })
}
