import { createMod, type Mod } from "../mod/index.ts"
import { aboutBool } from "./aboutBool.ts"

let mod: Mod | undefined = undefined

export function usePreludeMod(): Mod {
  if (mod) return mod

  mod = createMod(new URL("prelude:occam"))

  aboutBool(mod)

  return mod
}
