import { dirname } from "node:path"
import { definePrimitiveThunk } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

// This group of definitions are NOT part of prelude mod.

export function aboutModule(mod: Mod) {
  definePrimitiveThunk(mod, "current-module-file", () => {
    return Values.String(mod.url.pathname)
  })

  definePrimitiveThunk(mod, "current-module-directory", () => {
    return Values.String(dirname(mod.url.pathname))
  })
}
