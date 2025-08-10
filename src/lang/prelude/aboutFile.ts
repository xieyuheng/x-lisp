import fs from "node:fs"
import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFile(mod: Mod) {
  definePrimFn(mod, "file-read", 1, (x) => {
    const path = Values.asString(x).content
    const text = fs.readFileSync(path, { encoding: "utf8" })
    return Values.String(text)
  })

  definePrimFn(mod, "file-write", 2, (x, y) => {
    const path = Values.asString(x).content
    const text = Values.asString(y).content
    fs.writeFileSync(path, text, { encoding: "utf8" })
    return Values.Void()
  })
}
