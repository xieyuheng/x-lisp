import process from "node:process"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/formatValue.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinConsole(mod: Mod) {
  provide(mod, ["print", "write", "newline"])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    process.stdout.write(formatValue(value))
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "println", 1, (value) => {
    process.stdout.write(formatValue(value))
    process.stdout.write("\n")
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    process.stdout.write(Values.asStringValue(string).content)
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "newline", 0, () => {
    process.stdout.write("\n")
    return Values.VoidValue()
  })
}
