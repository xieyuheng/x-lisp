import { createMod, type Mod } from "../mod/index.ts"
import { aboutBool } from "./aboutBool.ts"
import { aboutFloat } from "./aboutFloat.ts"
import { aboutInt } from "./aboutInt.ts"
import { aboutString } from "./aboutString.ts"
import { aboutSymbol } from "./aboutSymbol.ts"
import { aboutValue } from "./aboutValue.ts"

let mod: Mod | undefined = undefined

export function usePreludeMod(): Mod {
  if (mod) return mod

  mod = createMod(new URL("prelude:occam"))

  aboutBool(mod)
  aboutInt(mod)
  aboutFloat(mod)
  aboutSymbol(mod)
  aboutString(mod)
  aboutValue(mod)

  return mod
}
