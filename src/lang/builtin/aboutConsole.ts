import process from "node:process"
import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutConsole(mod: Mod) {
  definePrimitiveFunction(mod, "print", 1, (x) => {
    process.stdout.write(formatValue(x))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "println", 1, (x) => {
    process.stdout.write(formatValue(x))
    process.stdout.write("\n")
    return Values.Void()
  })

  definePrimitiveFunction(mod, "write", 1, (x) => {
    process.stdout.write(Values.asString(x).content)
    return Values.Void()
  })

  definePrimitiveFunction(mod, "writeln", 1, (x) => {
    process.stdout.write(Values.asString(x).content)
    process.stdout.write("\n")
    return Values.Void()
  })
}
