import * as X from "@xieyuheng/x-sexp.js"
import process from "node:process"
import { globals } from "../../globals.ts"
import {
  definePrimitiveFunction,
  definePrimitiveThunk,
  provide,
} from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutProcess(mod: Mod) {
  provide(mod, [
    "current-working-directory",
    "current-command-line-args",
    "exit",
  ])

  definePrimitiveThunk(mod, "current-working-directory", () => {
    return Values.String(process.cwd())
  })

  definePrimitiveThunk(mod, "current-command-line-args", () => {
    const input = ["(", ...globals.commandLineArgs, ")"].join(" ")
    return X.parseSexp(input)
  })

  definePrimitiveFunction(mod, "exit", 1, (info) => {
    console.log(formatValue(info))
    process.exit(1)
  })
}
