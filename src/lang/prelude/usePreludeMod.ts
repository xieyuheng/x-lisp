import { createMod, type Mod } from "../mod/index.ts"
import { aboutBool } from "./aboutBool.ts"
import { aboutConsole } from "./aboutConsole.ts"
import { aboutFile } from "./aboutFile.ts"
import { aboutFloat } from "./aboutFloat.ts"
import { aboutInt } from "./aboutInt.ts"
import { aboutList } from "./aboutList.ts"
import { aboutOptional } from "./aboutOptional.ts"
import { aboutPath } from "./aboutPath.ts"
import { aboutPredicate } from "./aboutPredicate.ts"
import { aboutProcess } from "./aboutProcess.ts"
import { aboutRecord } from "./aboutRecord.ts"
import { aboutSexp } from "./aboutSexp.ts"
import { aboutString } from "./aboutString.ts"
import { aboutSymbol } from "./aboutSymbol.ts"
import { aboutValue } from "./aboutValue.ts"
import { aboutVoid } from "./aboutVoid.ts"

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
  aboutList(mod)
  aboutRecord(mod)
  aboutPredicate(mod)
  aboutSexp(mod)
  aboutFile(mod)
  aboutPath(mod)
  aboutProcess(mod)
  aboutConsole(mod)
  aboutVoid(mod)
  aboutOptional(mod)

  return mod
}
