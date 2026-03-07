import { formatUnderTag } from "@xieyuheng/helpers.js/format"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import * as L from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinError(mod: Mod) {
  provide(mod, ["error"])

  definePrimitiveFunction(mod, "error", 1, (value) => {
    let message = L.asStringValue(value).content
    throw new Error(message)
  })
}
