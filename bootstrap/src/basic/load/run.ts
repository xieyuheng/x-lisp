import { call, createContext } from "../execute/index.ts"
import { type Mod } from "../mod/index.ts"

export function run(mod: Mod): void {
  const context = createContext(mod)
  call(context, "main", [])
}
