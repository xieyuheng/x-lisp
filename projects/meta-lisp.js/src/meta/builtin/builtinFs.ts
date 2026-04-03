import fs from "node:fs"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinFs(mod: Mod) {
  provide(mod, [
    "fs-exists?",
    "fs-file?",
    "fs-directory?",
    "fs-read",
    "fs-write",
    "fs-directory-contents",
    "fs-directory-contents-recursive",
    "fs-make-directory",
    "fs-delete-file",
    "fs-delete-directory",
    "fs-delete-recursive",
    "fs-rename",
  ])

  definePrimitiveFunction(mod, "fs-exists?", 1, (path) => {
    return M.BoolValue(fs.existsSync(M.asStringValue(path).content))
  })

  definePrimitiveFunction(mod, "fs-file?", 1, (path) => {
    return M.BoolValue(fs.statSync(M.asStringValue(path).content).isFile())
  })

  definePrimitiveFunction(mod, "fs-directory?", 1, (path) => {
    return M.BoolValue(fs.statSync(M.asStringValue(path).content).isDirectory())
  })

  definePrimitiveFunction(mod, "fs-read", 1, (path) => {
    return M.StringValue(
      fs.readFileSync(M.asStringValue(path).content, "utf-8"),
    )
  })

  definePrimitiveFunction(mod, "fs-write", 2, (path, string) => {
    fs.writeFileSync(
      M.asStringValue(path).content,
      M.asStringValue(string).content,
    )
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "fs-directory-contents", 1, (path) => {
    return M.ListValue(
      fs
        .readdirSync(M.asStringValue(path).content, {
          encoding: "utf-8",
        })
        .map((fileName) => M.StringValue(fileName)),
    )
  })

  definePrimitiveFunction(mod, "fs-directory-contents-recursive", 1, (path) => {
    return M.ListValue(
      fs
        .readdirSync(M.asStringValue(path).content, {
          encoding: "utf-8",
          recursive: true,
        })
        .map((fileName) => M.StringValue(fileName)),
    )
  })

  definePrimitiveFunction(mod, "fs-delete-file", 1, (path) => {
    fs.unlinkSync(M.asStringValue(path).content)
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "fs-delete-directory", 1, (path) => {
    fs.rmdirSync(M.asStringValue(path).content)
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "fs-delete-recursive", 1, (path) => {
    fs.rmSync(M.asStringValue(path).content, { recursive: true })
    return M.VoidValue()
  })

  definePrimitiveFunction(mod, "fs-rename", 2, (oldPath, newPath) => {
    fs.renameSync(
      M.asStringValue(oldPath).content,
      M.asStringValue(newPath).content,
    )
    return M.VoidValue()
  })
}
