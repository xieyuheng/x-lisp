import { type Definition } from "../definition/index.ts"
import { type Mod } from "../mod/index.ts"

export function include(mod: Mod, name: string, definition: Definition): void {
  mod.definitions.set(name, definition)
  mod.exported.add(name)
}
