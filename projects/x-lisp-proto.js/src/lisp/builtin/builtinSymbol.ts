import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSymbol(mod: Mod) {
  provide(mod, [
    "symbol?",
    "symbol-length",
    "symbol-to-string",
    "symbol-append",
    "symbol-concat",
  ])

  definePrimitiveFunction(mod, "symbol?", 1, (value) => {
    return Values.Bool(Values.isSymbol(value))
  })

  definePrimitiveFunction(mod, "symbol-length", 1, (symbol) => {
    return Values.Int(BigInt(Values.asSymbol(symbol).content.length))
  })

  definePrimitiveFunction(mod, "symbol-to-string", 1, (symbol) => {
    return Values.String(Values.asSymbol(symbol).content)
  })

  definePrimitiveFunction(mod, "symbol-append", 2, (left, right) => {
    return Values.Symbol(
      Values.asSymbol(left).content + Values.asSymbol(right).content,
    )
  })

  definePrimitiveFunction(mod, "symbol-concat", 1, (list) => {
    return Values.Symbol(
      Values.asTael(list)
        .elements.map((string) => Values.asSymbol(string).content)
        .join(""),
    )
  })
}
