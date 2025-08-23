import process from "node:process"
import {
  definePrimitiveFunction,
  definePrimitiveThunk,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutProcess(mod: Mod) {
  definePrimitiveThunk(mod, "current-working-directory", () => {
    return Values.String(process.cwd())
  })

  definePrimitiveFunction(mod, "exit", 1, (message) => {
    console.log(Values.asString(message).content)
    process.exit(1)
  })
}
