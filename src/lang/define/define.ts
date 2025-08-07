import { modSet, type Mod } from "../mod/index.ts"
import type { Value } from "../value/index.ts"

export function defineValue(mod: Mod, name: string, value: Value): void {
  modSet(mod, name, { mod, name, value })
}
