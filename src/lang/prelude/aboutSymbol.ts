import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutSymbol(mod: Mod): void {
  definePrimFn(mod, "symbol-length", 1, (x) =>
    Values.Int(Values.asSymbol(x).content.length),
  )

  definePrimFn(mod, "symbol-to-string", 1, (x) =>
    Values.String(Values.asSymbol(x).content),
  )
}
