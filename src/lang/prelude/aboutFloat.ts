import { definePrimFn } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutFloat(mod: Mod) {
  definePrimFn(mod, "float?", 1, (x) => Values.Bool(Values.isFloat(x)))

  definePrimFn(mod, "fadd", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content + Values.asFloat(y).content),
  )

  definePrimFn(mod, "fsub", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content - Values.asFloat(y).content),
  )

  definePrimFn(mod, "fmul", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content + Values.asFloat(y).content),
  )

  definePrimFn(mod, "fdiv", 2, (x, y) =>
    Values.Float(Values.asFloat(x).content / Values.asFloat(y).content),
  )
}
