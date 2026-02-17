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
    return Values.BoolValue(Values.isSymbolValue(value))
  })

  definePrimitiveFunction(mod, "symbol-length", 1, (symbol) => {
    return Values.IntValue(BigInt(Values.asSymbolValue(symbol).content.length))
  })

  definePrimitiveFunction(mod, "symbol-to-string", 1, (symbol) => {
    return Values.StringValue(Values.asSymbolValue(symbol).content)
  })

  definePrimitiveFunction(mod, "symbol-append", 2, (left, right) => {
    return Values.SymbolValue(
      Values.asSymbolValue(left).content + Values.asSymbolValue(right).content,
    )
  })

  definePrimitiveFunction(mod, "symbol-concat", 1, (list) => {
    return Values.SymbolValue(
      Values.asTaelValue(list)
        .elements.map((string) => Values.asSymbolValue(string).content)
        .join(""),
    )
  })
}
