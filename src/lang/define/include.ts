import { type Definition, type Mod } from "../mod/index.ts"

export function include(mod: Mod, name: string, definition: Definition): void {
  mod.defined.set(name, definition)
  mod.exported.add(name)
}
