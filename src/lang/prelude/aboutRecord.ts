import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutRecord(mod: Mod) {
  definePrimitiveFunction(mod, "record?", 1, (x) =>
    Values.Bool(x.kind === "Tael"),
  )

  definePrimitiveFunction(mod, "record-length", 1, (x) =>
    Values.Int(Object.keys(Values.asTael(x).attributes).length),
  )

  definePrimitiveFunction(mod, "record-update", 2, (x, y) =>
    Values.Tael(Values.asTael(x).elements, {
      ...Values.asTael(x).attributes,
      ...Values.asTael(y).attributes,
    }),
  )

  definePrimitiveFunction(mod, "record-of", 1, (x) =>
    Values.Record({ ...Values.asTael(x).attributes }),
  )
}
