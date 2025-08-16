import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSymbol(mod: Mod) {
  definePrimitiveFunction(mod, "symbol?", 1, (value) => {
    return Values.Bool(Values.isSymbol(value))
  })

  definePrimitiveFunction(mod, "symbol-length", 1, (symbol) => {
    return Values.Int(Values.asSymbol(symbol).content.length)
  })

  definePrimitiveFunction(mod, "symbol-to-string", 1, (symbol) => {
    return Values.String(Values.asSymbol(symbol).content)
  })
}
