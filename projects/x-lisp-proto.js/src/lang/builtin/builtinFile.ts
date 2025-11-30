import fs from "node:fs"
import Path from "node:path"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinFile(mod: Mod) {
  provide(mod, [
    "file-exists?",
    "file-size",
    "file-load",
    "file-save",
    "file-delete",
    "file-directory",
    "directory-exists?",
    "directory-create",
    "directory-create-recursively",
    "directory-delete",
    "directory-delete-recursively",
    "directory-files",
    "directory-files-recursively",
    "directory-directories",
    "directory-directories-recursively",
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

    return Values.Int(BigInt(stats.size))
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

  definePrimitiveFunction(mod, "file-directory", 1, (path) => {
    return Values.String(Path.dirname(Values.asString(path).content))
  })

  definePrimitiveFunction(mod, "file-delete", 1, (path) => {
    const pathString = Values.asString(path).content
    const stats = fs.statSync(pathString, {
      throwIfNoEntry: false,
    })

    if (!stats) {
      throw new Error(`(file-delete) file does not exist: ${pathString}`)
    }

    if (!stats.isFile()) {
      throw new Error(`(file-delete) path is not file: ${pathString}`)
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

  definePrimitiveFunction(mod, "directory-delete", 1, (path) => {
    fs.rmdirSync(Values.asString(path).content)
    return Values.Void()
  })

  definePrimitiveFunction(mod, "directory-delete-recursively", 1, (path) => {
    fs.rmdirSync(Values.asString(path).content, { recursive: true })
    return Values.Void()
  })

  definePrimitiveFunction(mod, "directory-files", 1, (path) => {
    const pathString = Values.asString(path).content
    const files = fs
      .readdirSync(pathString, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => Path.join(dirent.parentPath, dirent.name))
    return Values.List(files.map(Values.String))
  })

  definePrimitiveFunction(mod, "directory-files-recursively", 1, (path) => {
    const pathString = Values.asString(path).content
    const files = fs
      .readdirSync(pathString, { withFileTypes: true, recursive: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => Path.join(dirent.parentPath, dirent.name))
    return Values.List(files.map(Values.String))
  })

  definePrimitiveFunction(mod, "directory-directories", 1, (path) => {
    const pathString = Values.asString(path).content
    const files = fs
      .readdirSync(pathString, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => Path.join(dirent.parentPath, dirent.name))
    return Values.List(files.map(Values.String))
  })

  definePrimitiveFunction(
    mod,
    "directory-directories-recursively",
    1,
    (path) => {
      const pathString = Values.asString(path).content
      const files = fs
        .readdirSync(pathString, { withFileTypes: true, recursive: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => Path.join(dirent.parentPath, dirent.name))
      return Values.List(files.map(Values.String))
    },
  )
}
