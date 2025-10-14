import * as X from "@xieyuheng/x-sexp.js"
import process from "node:process"
import { globals } from "../../globals.ts"
import {
  definePrimitiveFunction,
  definePrimitiveNullaryLambda,
  provide,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import { prettyValue } from "../pretty/index.ts"
import * as Values from "../value/index.ts"

export function aboutProcess(mod: Mod) {
  provide(mod, [
    "current-working-directory",
    "current-command-line-args",
    "exit",
  ])

  definePrimitiveNullaryLambda(mod, "current-working-directory", () => {
    return Values.String(process.cwd())
  })

  definePrimitiveNullaryLambda(mod, "current-command-line-args", () => {
    const input = ["(", ...globals.commandLineArgs, ")"].join(" ")
    return X.parseSexp(input)
  })

  definePrimitiveFunction(mod, "exit", 1, (info) => {
    console.log(prettyValue(globals.maxWidth, info))
    process.exit(1)
  })
}
