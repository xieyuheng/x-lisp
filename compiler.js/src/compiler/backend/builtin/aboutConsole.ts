import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutConsole(mod: Mod) {
  definePrimitiveFunction(mod, "print", 1, (value) => {
    console.log(formatValue(value))
    return Values.Void()
  })
}
