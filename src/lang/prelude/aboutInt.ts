import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutInt(mod: Mod): void {
  definePrimFn(mod, "int?", 1, (x) => Values.Bool(Values.isInt(x)))

  definePrimFn(mod, "iadd", 2, (x, y) =>
    Values.Int(Values.asInt(x).content + Values.asInt(y).content),
  )

  definePrimFn(mod, "isub", 2, (x, y) =>
    Values.Int(Values.asInt(x).content - Values.asInt(y).content),
  )

  definePrimFn(mod, "imul", 2, (x, y) =>
    Values.Int(Values.asInt(x).content + Values.asInt(y).content),
  )

  definePrimFn(mod, "idiv", 2, (x, y) =>
    Values.Int(Math.trunc(Values.asInt(x).content / Values.asInt(y).content)),
  )

  definePrimFn(mod, "imod", 2, (x, y) =>
    Values.Int(Values.asInt(x).content % Values.asInt(y).content),
  )
}
