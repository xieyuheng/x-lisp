import { createMod, type Mod } from "../mod/index.ts"
import { builtinApply } from "./builtinApply.ts"
import { builtinBool } from "./builtinBool.ts"
import { builtinConsole } from "./builtinConsole.ts"
import { builtinCurry } from "./builtinCurry.ts"
import { builtinFloat } from "./builtinFloat.ts"
import { builtinFunction } from "./builtinFunction.ts"
import { builtinInt } from "./builtinInt.ts"
import { builtinRandom } from "./builtinRandom.ts"
import { builtinValue } from "./builtinValue.ts"

let mod: Mod | undefined = undefined

export function useBuiltinMod(): Mod {
  if (mod) return mod

  mod = createMod(new URL("builtin:"), new Map())

  builtinValue(mod)
  builtinConsole(mod)
  builtinBool(mod)
  builtinInt(mod)
  builtinFloat(mod)
  builtinCurry(mod)
  builtinFunction(mod)
  builtinRandom(mod)
  builtinApply(mod)

  return mod
}

export function useBuiltinNames(): Array<string> {
  const builtinMod = useBuiltinMod()
  return Array.from(builtinMod.definitions.keys())
}
