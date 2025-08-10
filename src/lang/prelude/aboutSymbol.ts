import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSymbol(mod: Mod) {
  definePrimitiveFunction(mod, "symbol?", 1, (x) =>
    Values.Bool(Values.isSymbol(x)),
  )

  definePrimitiveFunction(mod, "symbol-length", 1, (x) =>
    Values.Int(Values.asSymbol(x).content.length),
  )

  definePrimitiveFunction(mod, "symbol-to-string", 1, (x) =>
    Values.String(Values.asSymbol(x).content),
  )
}
