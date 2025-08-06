import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutList(mod: Mod): void {
  definePrimFn(mod, "list-length", 1, (x) =>
    Values.Int(Values.asTael(x).elements.length),
  )

  definePrimFn(mod, "list-append", 2, (x, y) =>
    Values.Tael(
      [...Values.asTael(x).elements, ...Values.asTael(y).elements],
      Values.asTael(x).attributes,
    ),
  )

  definePrimFn(mod, "list-of", 1, (x) =>
    Values.List([...Values.asTael(x).elements]),
  )
}
