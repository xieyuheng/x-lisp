import { write } from "@xieyuheng/helpers.js/file"
import { definePrimitiveFunction } from "../define/index.ts"
import { formatValue } from "../format/formatValue.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFile(mod: Mod) {
  definePrimitiveFunction(mod, "print", 1, (value) => {
    write(formatValue(value))
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "println", 1, (value) => {
    write(formatValue(value))
    write("\n")
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "write", 1, (string) => {
    write(M.asStringValue(string).content)
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "newline", 0, () => {
    write("\n")
    return M.VoidValue()
  })
}
