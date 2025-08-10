import { parseData, parseDataArray } from "@xieyuheng/x-data.js"
import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutSexp(mod: Mod) {
  definePrimitiveFunction(mod, "parse-sexp", 1, (x) =>
    parseData(Values.asString(x).content),
  )

  definePrimitiveFunction(mod, "parse-sexps", 1, (x) =>
    Values.List(parseDataArray(Values.asString(x).content)),
  )
}
