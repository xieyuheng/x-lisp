import { createMod, type Mod } from "../mod/index.ts"
import { aboutBool } from "./aboutBool.ts"
import { aboutFloat } from "./aboutFloat.ts"
import { aboutInt } from "./aboutInt.ts"
import { aboutList } from "./aboutList.ts"
import { aboutPredicate } from "./aboutPredicate.ts"
import { aboutRecord } from "./aboutRecord.ts"
import { aboutString } from "./aboutString.ts"
import { aboutSymbol } from "./aboutSymbol.ts"
import { aboutValue } from "./aboutValue.ts"

let mod: Mod | undefined = undefined

export async function usePreludeMod(): Promise<Mod> {
  if (mod) return mod

  mod = createMod(new URL("prelude:occam"))

  await aboutBool(mod)
  await aboutInt(mod)
  await aboutFloat(mod)
  await aboutSymbol(mod)
  await aboutString(mod)
  await aboutValue(mod)
  await aboutList(mod)
  await aboutRecord(mod)
  await aboutPredicate(mod)

  return mod
}
