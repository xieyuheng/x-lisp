import {
  definePrimitiveFunction,
  definePrimitiveVariable,
} from "../define/index.ts"
import * as M from "../index.ts"
import { type Mod } from "../mod/index.ts"

export function builtinVoid(mod: Mod) {
  definePrimitiveVariable(mod, "void", M.VoidValue())

  definePrimitiveFunction(mod, "void?", 1, (value) => {
    return M.BoolValue(M.isVoidValue(value))
  })
}
