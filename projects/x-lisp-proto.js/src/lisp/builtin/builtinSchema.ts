import { definePrimitiveFunction, provide } from "../define/index.ts"
import { isValid } from "../evaluate/validate.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinSchema(mod: Mod) {
  provide(mod, ["valid?"])

  definePrimitiveFunction(mod, "valid?", 2, (schema, value) => {
    return Values.BoolValue(isValid(schema, value))
  })
}
