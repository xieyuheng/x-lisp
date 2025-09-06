import fs from "node:fs"
import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFile(mod: Mod) {
  provide(mod, ["file-get", "file-set!"])

  definePrimitiveFunction(mod, "file-get", 1, (path) => {
    const text = fs.readFileSync(Values.asString(path).content, "utf8")
    return Values.String(text)
  })

  definePrimitiveFunction(mod, "file-set!", 2, (path, text) => {
    fs.writeFileSync(
      Values.asString(path).content,
      Values.asString(text).content,
      "utf8",
    )
    return Values.Void()
  })
}
