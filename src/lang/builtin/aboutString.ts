import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutString(mod: Mod) {
  definePrimitiveFunction(mod, "string?", 1, (value) => {
    return Values.Bool(Values.isString(value))
  })

  definePrimitiveFunction(mod, "string-length", 1, (string) => {
    return Values.Int(Values.asString(string).content.length)
  })
}
