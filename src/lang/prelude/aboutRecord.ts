import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"
import { definePrimFn } from "./definePrimFn.ts"

export function aboutRecord(mod: Mod): void {
  definePrimFn(mod, "record-length", 1, (x) =>
    Values.Int(Object.keys(Values.asTael(x).attributes).length),
  )

  definePrimFn(mod, "record-update", 2, (x, y) =>
    Values.Record({
      ...Values.asTael(x).attributes,
      ...Values.asTael(y).attributes,
    }),
  )

  definePrimFn(mod, "record-of", 1, (x) =>
    Values.Record({ ...Values.asTael(x).attributes }),
  )
}
