import fs from "node:fs"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFile(mod: Mod) {
  provide(mod, [
    "file-exists?",
    "file-size",
    "file-load",
    "file-save",
    "file-remove",
    "directory-exists?",
    "directory-create",
    "directory-create-recursively",
    // "directory-remove",
    // "directory-remove-recursively",
    // "directory-files",
    // "directory-directories",
  ])

  definePrimitiveFunction(mod, "file-exists?", 1, (path) => {
    const stats = fs.statSync(Values.asString(path).content, {
      throwIfNoEntry: false,
    })

    if (!stats) {
      return Values.Bool(false)
    } else {
      return Values.Bool(stats.isFile())
    }
  })

  definePrimitiveFunction(mod, "file-size", 1, (path) => {
    const pathString = Values.asString(path).content
    const stats = fs.statSync(pathString, {
      throwIfNoEntry: false,
    })

    if (!stats) {
      throw new Error(`(file-size) file does not exist: ${pathString}`)
    }

    return Values.Int(stats.size)
  })

  definePrimitiveFunction(mod, "file-load", 1, (path) => {
    const text = fs.readFileSync(Values.asString(path).content, "utf8")
    return Values.String(text)
  })

  definePrimitiveFunction(mod, "file-save", 2, (path, text) => {
    fs.writeFileSync(
      Values.asString(path).content,
      Values.asString(text).content,
      "utf8",
    )
    return Values.Void()
  })

  definePrimitiveFunction(mod, "file-remove", 1, (path) => {
    const pathString = Values.asString(path).content

    const stats = fs.statSync(pathString, {
      throwIfNoEntry: false,
    })

    if (!stats) {
      throw new Error(`(file-remove) file does not exist: ${pathString}`)
    }

    if (!stats.isFile()) {
      throw new Error(`(file-remove) path is not file: ${pathString}`)
    }

    fs.rmSync(pathString)
    return Values.Void()
  })

  definePrimitiveFunction(mod, "directory-exists?", 1, (path) => {
    const stats = fs.statSync(Values.asString(path).content, {
      throwIfNoEntry: false,
    })

    if (!stats) {
      return Values.Bool(false)
    } else {
      return Values.Bool(stats.isDirectory())
    }
  })

  definePrimitiveFunction(mod, "directory-create", 1, (path) => {
    fs.mkdirSync(Values.asString(path).content)
    return Values.Void()
  })

  definePrimitiveFunction(mod, "directory-create-recursively", 1, (path) => {
    fs.mkdirSync(Values.asString(path).content, { recursive: true })
    return Values.Void()
  })
}
