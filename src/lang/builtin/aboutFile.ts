import fs from "node:fs"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFile(mod: Mod) {
  provide(mod, ["file-load", "file-save"])

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
}
