import { createMod, type Mod } from "../mod/index.ts"
import { aboutBool } from "./aboutBool.ts"
import { aboutConsole } from "./aboutConsole.ts"
import { aboutCurry } from "./aboutCurry.ts"
import { aboutFloat } from "./aboutFloat.ts"
import { aboutInt } from "./aboutInt.ts"
import { aboutValue } from "./aboutValue.ts"

let mod: Mod | undefined = undefined

export function useBuiltinMod(): Mod {
  if (mod) return mod

  mod = createMod(new URL("builtin:prelude"))

  aboutValue(mod)
  aboutConsole(mod)
  aboutBool(mod)
  aboutInt(mod)
  aboutFloat(mod)
  aboutCurry(mod)

  return mod
}
