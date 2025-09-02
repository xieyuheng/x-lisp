import { stringToSubscript } from "../../utils/string/stringToSubscript.ts"
import { stringToSuperscript } from "../../utils/string/stringToSuperscript.ts"
import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFormat(mod: Mod) {
  definePrimitiveFunction(mod, "format-subscript", 1, (n) => {
    if (Values.asInt(n).content < 0) {
      let message = `(format-subscript) expect argument to be non-negative int\n`
      message += `  argument: ${formatValue(n)}`
      throw new Error(message)
    }

    return Values.String(stringToSubscript(Values.asInt(n).content.toString()))
  })

  definePrimitiveFunction(mod, "format-superscript", 1, (n) => {
    if (Values.asInt(n).content < 0) {
      let message = `(format-superscript) expect argument to be non-negative int\n`
      message += `  argument: ${formatValue(n)}`
      throw new Error(message)
    }

    return Values.String(
      stringToSuperscript(Values.asInt(n).content.toString()),
    )
  })
}
