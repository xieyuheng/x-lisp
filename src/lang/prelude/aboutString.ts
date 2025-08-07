import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutString(mod: Mod): void {
  definePrimFn(mod, "string-length", 1, (x) =>
    Values.Int(Values.asString(x).content.length),
  )
}
