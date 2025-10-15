import { stringToSubscript } from "../../helper/string/stringToSubscript.ts"
import { stringToSuperscript } from "../../helper/string/stringToSuperscript.ts"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFormat(mod: Mod) {
  provide(mod, ["format", "format-subscript", "format-superscript"])

  definePrimitiveFunction(mod, "format", 1, (value) => {
    return Values.String(formatValue(value))
  })

  definePrimitiveFunction(mod, "format-subscript", 1, (n) => {
    return Values.String(stringToSubscript(Values.asInt(n).content.toString()))
  })

  definePrimitiveFunction(mod, "format-superscript", 1, (n) => {
    return Values.String(
      stringToSuperscript(Values.asInt(n).content.toString()),
    )
  })
}
