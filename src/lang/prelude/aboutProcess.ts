import process from "node:process"
import {
  definePrimitiveFunction,
  definePrimitiveThunk,
} from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutProcess(mod: Mod) {
  definePrimitiveThunk(mod, "current-working-directory", () =>
    Values.String(process.cwd()),
  )

  definePrimitiveFunction(mod, "exit", 1, (x) => {
    console.log(Values.asString(x).content)
    process.exit(1)
  })
}
