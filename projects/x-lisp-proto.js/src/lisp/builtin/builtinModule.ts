import { dirname } from "node:path"
import { definePrimitiveNullaryFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

// This group of definitions are NOT part of prelude mod.

export function builtinModule(mod: Mod) {
  definePrimitiveNullaryFunction(mod, "current-module-file", () => {
    return Values.StringValue(mod.url.pathname)
  })

  definePrimitiveNullaryFunction(mod, "current-module-directory", () => {
    return Values.StringValue(dirname(mod.url.pathname))
  })
}
