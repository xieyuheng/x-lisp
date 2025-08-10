import process from "node:process"
import { definePrimitiveThunk } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutProcess(mod: Mod) {
  definePrimitiveThunk(mod, "current-working-directory", () =>
    Values.String(process.cwd()),
  )
}
