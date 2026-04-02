import { write, openInputFile, openOutputFile, fileClose } from "@xieyuheng/helpers.js/file"
import {
  definePrimitiveFunction,
  definePrimitiveVariable,
  provide,
} from "../define/index.ts"
import { formatValue } from "../format/formatValue.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFile(mod: Mod) {
  provide(mod, ["file-t", "open-input-file", "open-output-file", "print", "write", "newline"])

  definePrimitiveVariable(mod, "file-t", M.createAtomType("file"))

  definePrimitiveFunction(mod, "open-input-file", 1, (path) => {
    return M.FileValue(openInputFile(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "open-output-file", 1, (path) => {
    return M.FileValue(openOutputFile(M.asStringValue(path).content))
  })

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
