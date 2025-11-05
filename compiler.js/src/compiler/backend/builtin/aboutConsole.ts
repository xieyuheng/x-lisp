import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutConsole(mod: Mod) {
  definePrimitiveFunction(mod, "print", 1, (value) => {
    process.stdout.write(formatValue(value))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "print-non-void", 1, (value) => {
    if (!Values.isVoid(value)) {
      process.stdout.write(formatValue(value))
    }

    return Values.Void()
  })


  definePrimitiveFunction(mod, "newline", 0, () => {
    process.stdout.write("\n")
    return Values.Void()
  })
}
