import * as S from "@xieyuheng/sexp.js"
import process from "node:process"
import { textWidth } from "../../config.ts"
import { globals } from "../../globals.ts"
import {
  definePrimitiveFunction,
  definePrimitiveNullaryFunction,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"

export function builtinProcess(mod: Mod) {
  provide(mod, [
    "current-working-directory",
    "current-command-line-args",
    "exit",
  ])

  definePrimitiveNullaryFunction(mod, "current-working-directory", () => {
    return Values.StringValue(process.cwd())
  })

  definePrimitiveNullaryFunction(mod, "current-command-line-args", () => {
    const input = ["(", ...globals.commandLineArgs, ")"].join(" ")
    return S.parseSexp(input)
  })

  definePrimitiveFunction(mod, "exit", 1, (info) => {
    console.log(prettyValue(textWidth, info))
    process.exit(1)
  })
}
