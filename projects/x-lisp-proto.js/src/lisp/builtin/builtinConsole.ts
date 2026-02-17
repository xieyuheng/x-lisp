import process from "node:process"
import { textWidth } from "../../config.ts"
import {
  definePrimitiveFunction,
  definePrimitiveNullaryFunction,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"

export function builtinConsole(mod: Mod) {
  provide(mod, ["print", "write", "newline"])

  definePrimitiveFunction(mod, "print", 1, (value) => {
    process.stdout.write(prettyValue(textWidth, value))
    return Values.VoidValue()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    process.stdout.write(Values.asStringValue(string).content)
    return Values.VoidValue()
  })

  definePrimitiveNullaryFunction(mod, "newline", () => {
    process.stdout.write("\n")
    return Values.VoidValue()
  })
}
