import { definePrimitiveFunction } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFloat(mod: Mod) {
  definePrimitiveFunction(mod, "float?", 1, (x) =>
    Values.Bool(Values.isFloat(x)),
  )

  definePrimitiveFunction(mod, "fadd", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content + Values.asFloat(y).content),
  )

  definePrimitiveFunction(mod, "fsub", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content - Values.asFloat(y).content),
  )

  definePrimitiveFunction(mod, "fmul", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content + Values.asFloat(y).content),
  )

  definePrimitiveFunction(mod, "fdiv", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content / Values.asFloat(y).content),
  )
}
