import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as L from "../index.ts"
import { builtinAssert } from "./builtinAssert.ts"
import { builtinBool } from "./builtinBool.ts"
import { builtinConsole } from "./builtinConsole.ts"
import { builtinFloat } from "./builtinFloat.ts"
import { builtinHash } from "./builtinHash.ts"
import { builtinHashtag } from "./builtinHashtag.ts"
import { builtinInt } from "./builtinInt.ts"
import { builtinList } from "./builtinList.ts"
import { builtinNull } from "./builtinNull.ts"
import { builtinRandom } from "./builtinRandom.ts"
import { builtinRecord } from "./builtinRecord.ts"
import { builtinSet } from "./builtinSet.ts"
import { builtinString } from "./builtinString.ts"
import { builtinSymbol } from "./builtinSymbol.ts"
import { builtinValue } from "./builtinValue.ts"
import { builtinVoid } from "./builtinVoid.ts"

let mod: L.Mod | undefined = undefined

export function useBuiltinMod(): L.Mod {
  if (mod) return mod

  const currentDir = path.dirname(fileURLToPath(import.meta.url))
  const file = path.join(currentDir, "../../../lisp/builtin/index.lisp")
  const url = createUrl(file)

  mod = L.createMod(url, L.createDependencyGraph())

  builtinInt(mod)
  builtinFloat(mod)
  builtinHashtag(mod)
  builtinBool(mod)
  builtinSymbol(mod)
  builtinString(mod)
  builtinValue(mod)
  builtinList(mod)
  builtinRecord(mod)
  builtinConsole(mod)
  builtinVoid(mod)
  builtinNull(mod)
  builtinRandom(mod)
  builtinSet(mod)
  builtinHash(mod)
  builtinAssert(mod)

  const code = fs.readFileSync(file, "utf-8")
  L.runCode(mod, code)

  return mod
}
