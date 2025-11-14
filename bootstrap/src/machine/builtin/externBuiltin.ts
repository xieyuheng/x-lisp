import * as B from "../../basic/index.ts"
import type { Mod } from "../mod/index.ts"

export function externBuiltin(mod: Mod): void {
  for (const name of B.useBuiltinNames()) {
    mod.externed.add(`x-${name}`)
  }
}
