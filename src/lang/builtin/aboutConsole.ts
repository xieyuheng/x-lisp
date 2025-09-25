import process from "node:process"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutConsole(mod: Mod) {
  provide(mod, ["print", "println", "write", "writeln"])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    process.stdout.write(formatValue(value))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "println", 1, (value) => {
    console.log(formatValue(value))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    process.stdout.write(Values.asString(string).content)
    return Values.Void()
  })

  definePrimitiveFunction(mod, "writeln", 1, (string) => {
    console.log(Values.asString(string).content)
    return Values.Void()
  })
}
