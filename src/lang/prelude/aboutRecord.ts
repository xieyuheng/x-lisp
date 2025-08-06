import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutRecord(mod: Mod): void {
  definePrimFn(mod, "record-length", 1, (x) =>
    Values.Int(Object.keys(Values.asTael(x).attributes).length),
  )

  // definePrimFn(mod, "list-append", 2, (x, y) =>
  //   Values.List([...Values.asTael(x).elements, ...Values.asTael(y).elements]),
  //             )

  // definePrimFn(mod, "list-of", 1, (x) =>
  //   Values.List([...Values.asTael(x).elements]),
  // )
}
