import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { runCode } from "../load/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { aboutBool } from "./aboutBool.ts"
import { aboutConsole } from "./aboutConsole.ts"
import { aboutFile } from "./aboutFile.ts"
import { aboutFloat } from "./aboutFloat.ts"
import { aboutFormat } from "./aboutFormat.ts"
import { aboutFunction } from "./aboutFunction.ts"
import { aboutHash } from "./aboutHash.ts"
import { aboutHashtag } from "./aboutHashtag.ts"
import { aboutInt } from "./aboutInt.ts"
import { aboutList } from "./aboutList.ts"
import { aboutNull } from "./aboutNull.ts"
import { aboutOptional } from "./aboutOptional.ts"
import { aboutPath } from "./aboutPath.ts"
import { aboutProcess } from "./aboutProcess.ts"
import { aboutRandom } from "./aboutRandom.ts"
import { aboutRecord } from "./aboutRecord.ts"
import { aboutSet } from "./aboutSet.ts"
import { aboutSexp } from "./aboutSexp.ts"
import { aboutSortOrder } from "./aboutSortOrder.ts"
import { aboutString } from "./aboutString.ts"
import { aboutSymbol } from "./aboutSymbol.ts"
import { aboutSystem } from "./aboutSystem.ts"
import { aboutValue } from "./aboutValue.ts"
import { aboutVoid } from "./aboutVoid.ts"

let mod: Mod | undefined = undefined

export function useBuiltinMod(): Mod {
  if (mod) return mod

  mod = createMod(new URL("buildin:prelude"))

  aboutBool(mod)
  aboutInt(mod)
  aboutFloat(mod)
  aboutSymbol(mod)
  aboutString(mod)
  aboutValue(mod)
  aboutSortOrder(mod)
  aboutList(mod)
  aboutRecord(mod)
  aboutSexp(mod)
  aboutFile(mod)
  aboutPath(mod)
  aboutProcess(mod)
  aboutConsole(mod)
  aboutVoid(mod)
  aboutNull(mod)
  aboutOptional(mod)
  aboutFunction(mod)
  aboutFormat(mod)
  aboutRandom(mod)
  aboutSystem(mod)
  aboutSet(mod)
  aboutHashtag(mod)
  aboutHash(mod)

  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const schemaFile = path.join(currentDir, "../../../builtin/index.lisp")
  const schemaCode = fs.readFileSync(schemaFile, "utf-8")
  runCode(mod, schemaCode)

  return mod
}
