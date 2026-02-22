import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { runCode } from "../load/index.ts"
import { createMod, type Mod } from "../mod/index.ts"
import { builtinAssert } from "./builtinAssert.ts"
import { builtinBool } from "./builtinBool.ts"
import { builtinConsole } from "./builtinConsole.ts"
import { builtinFile } from "./builtinFile.ts"
import { builtinFloat } from "./builtinFloat.ts"
import { builtinFormat } from "./builtinFormat.ts"
import { builtinHash } from "./builtinHash.ts"
import { builtinHashtag } from "./builtinHashtag.ts"
import { builtinInt } from "./builtinInt.ts"
import { builtinList } from "./builtinList.ts"
import { builtinNull } from "./builtinNull.ts"
import { builtinPath } from "./builtinPath.ts"
import { builtinRandom } from "./builtinRandom.ts"
import { builtinRecord } from "./builtinRecord.ts"
import { builtinSet } from "./builtinSet.ts"
import { builtinString } from "./builtinString.ts"
import { builtinSymbol } from "./builtinSymbol.ts"
import { builtinSystem } from "./builtinSystem.ts"
import { builtinValue } from "./builtinValue.ts"
import { builtinVoid } from "./builtinVoid.ts"

let mod: Mod | undefined = undefined

export function useBuiltinMod(): Mod {
  if (mod) return mod

  mod = createMod(new URL("builtin:"), new Map())

  builtinInt(mod)
  builtinFloat(mod)
  builtinHashtag(mod)
  builtinBool(mod)
  builtinSymbol(mod)
  builtinString(mod)
  builtinValue(mod)
  builtinList(mod)
  builtinRecord(mod)
  builtinFile(mod)
  builtinPath(mod)
  builtinConsole(mod)
  builtinVoid(mod)
  builtinNull(mod)
  builtinFormat(mod)
  builtinRandom(mod)
  builtinSystem(mod)
  builtinSet(mod)
  builtinHash(mod)
  builtinAssert(mod)

  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const schemaFile = path.join(currentDir, "../../../lisp/builtin/index.lisp")
  const schemaCode = fs.readFileSync(schemaFile, "utf-8")
  runCode(mod, schemaCode)

  return mod
}
