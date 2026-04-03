import {
  fileClose,
  fileRead,
  fileWrite,
  fileWriteln,
  openInputFile,
  openOutputFile,
  write,
} from "@xieyuheng/helpers.js/file"
import {
  definePrimitiveFunction,
  definePrimitiveVariable,
  provide,
} from "../define/index.ts"
import { formatValue } from "../format/formatValue.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFile(mod: Mod) {
  provide(mod, [
    "file-t",
    "open-input-file",
    "open-output-file",
    "file-close",
    "file-read",
    "file-write",
    "file-writeln",
    "print",
    "write",
    "newline",
  ])

  definePrimitiveVariable(mod, "file-t", M.createAtomType("file"))

  definePrimitiveFunction(mod, "open-input-file", 1, (path) => {
    return M.FileValue(openInputFile(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "open-output-file", 1, (path) => {
    return M.FileValue(openOutputFile(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "file-close", 1, (file) => {
    fileClose(M.asFileValue(file).file)
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "file-read", 1, (file) => {
    return M.StringValue(fileRead(M.asFileValue(file).file))
  })

  definePrimitiveFunction(mod, "file-write", 2, (file, string) => {
    fileWrite(M.asFileValue(file).file, M.asStringValue(string).content)
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "file-writeln", 2, (file, string) => {
    fileWriteln(M.asFileValue(file).file, M.asStringValue(string).content)
    return M.VoidValue()
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
