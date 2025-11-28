import { definePrimitiveFunction, provide } from "../define/index.ts"
import * as devices from "../devices/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinConsole(mod: Mod) {
  provide(mod, [
    "print",
    "println-non-void",
    // "write",
    "newline",
  ])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    devices.console.write(formatValue(value))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "println-non-void", 1, (value) => {
    if (!Values.isVoid(value)) {
      devices.console.write(formatValue(value) + "\n")
    }

    return Values.Void()
  })

  // definePrimitiveFunction(mod, "write", 1, (string) => {
  //   devices.console.write(Values.asString(string).content)
  //   return Values.Void()
  // })

  definePrimitiveFunction(mod, "newline", 0, () => {
    devices.console.write("\n")
    return Values.Void()
  })
}
