import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutString(mod: Mod) {
  definePrimitiveFunction(mod, "string?", 1, (x) =>
    Values.Bool(Values.isString(x)),
  )

  definePrimitiveFunction(mod, "string-length", 1, (x) =>
    Values.Int(Values.asString(x).content.length),
  )
}
