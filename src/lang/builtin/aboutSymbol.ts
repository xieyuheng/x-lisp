import { stringToSubscript } from "../../utils/string/stringToSubscript.ts"
import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
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

  definePrimitiveFunction(mod, "symbol-append-subscript", 2, (symbol, n) => {
    if (Values.asInt(n).content < 0) {
      let message = `(symbol-append-subscript) expect the second argument to be non-negative int\n`
      message += `  symbol: ${formatValue(symbol)}`
      message += `  n: ${formatValue(n)}`
      throw new Error(message)
    }

    return Values.Symbol(
      Values.asSymbol(symbol).content +
        stringToSubscript(Values.asInt(n).content.toString()),
    )
  })
}
