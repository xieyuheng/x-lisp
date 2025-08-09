import { definePrimFn } from "../define/index.ts"
import { the } from "../evaluate/index.ts"
import { type Mod } from "../mod/index.ts"

export function aboutSchema(mod: Mod) {
  definePrimFn(mod, "the", 2, the)
}
