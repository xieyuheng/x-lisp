import process from "node:process"
import { globals } from "../../globals.ts"
import {
  definePrimitiveFunction,
  definePrimitiveNullaryFunction,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"

export function aboutConsole(mod: Mod) {
  provide(mod, ["print", "write", "newline"])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    process.stdout.write(prettyValue(globals.maxWidth, value))
    return Values.Void()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    process.stdout.write(Values.asString(string).content)
    return Values.Void()
  })

  definePrimitiveNullaryFunction(mod, "newline", () => {
    process.stdout.write("\n")
    return Values.Void()
  })
}
