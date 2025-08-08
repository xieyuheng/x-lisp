import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export async function aboutString(mod: Mod) {
  definePrimFn(mod, "string?", 1, (x) => Values.Bool(Values.isString(x)))

  definePrimFn(mod, "string-length", 1, (x) =>
    Values.Int(Values.asString(x).content.length),
  )
}
