import {
  stringToSubscript,
  stringToSuperscript,
} from "@xieyuheng/helpers.js/string"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFormat(mod: Mod) {
  provide(mod, ["format", "format-subscript", "format-superscript"])

  definePrimitiveFunction(mod, "format", 1, (value) => {
    return Values.StringValue(formatValue(value))
  })

  definePrimitiveFunction(mod, "format-subscript", 1, (n) => {
    return Values.StringValue(
      stringToSubscript(Values.asIntValue(n).content.toString()),
    )
  })

  definePrimitiveFunction(mod, "format-superscript", 1, (n) => {
    return Values.StringValue(
      stringToSuperscript(Values.asIntValue(n).content.toString()),
    )
  })
}
