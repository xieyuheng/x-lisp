import { formatIndent } from "../../helpers/format/formatIndent.ts"
import type { Mod } from "../mod/index.ts"
import { shrink } from "../passes/005-shrink.ts"
import { uniquify } from "../passes/010-uniquify.ts"
import { prettyMod } from "../pretty/index.ts"

export function compilePasses(mod: Mod): void {
  logMod("mod", mod)
  mod = logMod("shrink", shrink(mod))
  mod = logMod("uniquify", uniquify(mod))
}

function logMod(tag: string, mod: Mod): Mod {
  console.log(`${tag}:`)
  console.log(formatIndent(4, "\n" + prettyMod(64, mod)))
  console.log()
  return mod
}
