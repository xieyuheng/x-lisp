import { call, createContext } from "../execute/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function run(mod: Mod): void {
  const context = createContext(mod)
  call(context, Values.FunctionRef("main", 0, { isPrimitive: false }), [])
}
