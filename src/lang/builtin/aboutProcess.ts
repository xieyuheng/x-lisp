import process from "node:process"
import {
  definePrimitiveFunction,
  definePrimitiveThunk,
} from "../define/index.ts"
import { formatValue } from "../format/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutProcess(mod: Mod) {
  definePrimitiveThunk(mod, "current-working-directory", () => {
    return Values.String(process.cwd())
  })

  definePrimitiveFunction(mod, "exit", 1, (info) => {
    process.stdout.write(formatValue(info))
    process.stdout.write("\n")
    process.exit(1)
  })
}
