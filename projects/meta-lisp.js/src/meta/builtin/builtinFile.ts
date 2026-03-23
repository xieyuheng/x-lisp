import { write } from "@xieyuheng/helpers.js/file"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/formatValue.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFile(mod: Mod) {
  provide(mod, ["print", "write", "newline"])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    write(formatValue(value))
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "println", 1, (value) => {
    write(formatValue(value))
    write("\n")
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    write(Values.asStringValue(string).content)
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "newline", 0, () => {
    write("\n")
    return Values.VoidValue()
  })
}
