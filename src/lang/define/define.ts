import { modSet, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export function define(mod: Mod, name: string, value: Value): void {
  modSet(mod, name, { mod, name, value })
}
