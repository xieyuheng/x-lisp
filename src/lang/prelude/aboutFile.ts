import fs from "node:fs"
import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFile(mod: Mod) {
  definePrimFn(mod, "file-read", 1, (x) => {
    const path = Values.asString(x).content
    const text = fs.readFileSync(path, "utf8")
    return Values.String(text)
  })
}
