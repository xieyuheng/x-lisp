import { definePrimitiveFunction, provide } from "../define/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutHash(mod: Mod) {
  provide(mod, ["hash?", "hash-empty?"])

  definePrimitiveFunction(mod, "hash?", 1, (value) => {
    return Values.Bool(Values.isHash(value))
  })

  definePrimitiveFunction(mod, "hash-empty?", 1, (value) => {
    return Values.Bool(Values.hashEntries(Values.asHash(value)).length === 0)
  })
}
