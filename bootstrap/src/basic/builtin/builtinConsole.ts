import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinConsole(mod: Mod) {
  provide(mod, ["print", "println-non-void", "write", "newline"])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    process.stdout.write(formatValue(value))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "println-non-void", 1, (value) => {
    if (!Values.isVoid(value)) {
      process.stdout.write(formatValue(value))
      process.stdout.write("\n")
    }

    return Values.Void()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    process.stdout.write(Values.asString(string).content)
    return Values.Void()
  })

  definePrimitiveFunction(mod, "newline", 0, () => {
    process.stdout.write("\n")
    return Values.Void()
  })
}
