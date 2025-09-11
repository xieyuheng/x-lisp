import fs from "node:fs"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFile(mod: Mod) {
  provide(mod, ["file-exists?", "file-load", "file-save", "file-remove"])

  definePrimitiveFunction(mod, "file-exists?", 1, (path) => {
    return Values.Bool(fs.existsSync(Values.asString(path).content))
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
    if (!fs.existsSync(pathString)) {
      throw new Error(`(file-remove) file does not exist: ${pathString}`)
    }

    fs.rmSync(pathString)
    return Values.Void()
  })
}
