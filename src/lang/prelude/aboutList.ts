import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutList(mod: Mod): void {
  definePrimFn(mod, "list-length", 1, (x) =>
    Values.Int(Values.asTael(x).elements.length),
  )
}
