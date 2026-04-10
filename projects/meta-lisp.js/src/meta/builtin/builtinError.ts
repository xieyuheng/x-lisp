import { definePrimitiveFunction } from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinError(mod: Mod) {
  definePrimitiveFunction(mod, "error", 1, (value) => {
    let message = M.asStringValue(value).content
    throw new Error(message)
  })
}
