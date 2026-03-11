import { createUrl } from "@xieyuheng/helpers.js/url"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as L from "../index.ts"
import { builtinAssert } from "./builtinAssert.ts"
import { builtinBool } from "./builtinBool.ts"
import { builtinConsole } from "./builtinConsole.ts"
import { builtinError } from "./builtinError.ts"
import { builtinFloat } from "./builtinFloat.ts"
import { builtinHash } from "./builtinHash.ts"
import { builtinInt } from "./builtinInt.ts"
import { builtinKeyword } from "./builtinKeyword.ts"
import { builtinList } from "./builtinList.ts"
import { builtinRandom } from "./builtinRandom.ts"
import { builtinSet } from "./builtinSet.ts"
import { builtinString } from "./builtinString.ts"
import { builtinSymbol } from "./builtinSymbol.ts"
import { builtinType } from "./builtinType.ts"
import { builtinValue } from "./builtinValue.ts"
import { builtinVoid } from "./builtinVoid.ts"

const currentDir = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(currentDir, "../../../lisp/builtin/index.lisp")
const url = createUrl(file)

export function loadBuiltinMod(dependencyGraph: L.DependencyGraph): L.Mod {
  const found = L.dependencyGraphLookupMod(dependencyGraph, url)
  if (found !== undefined) return found

  const mod = L.createMod(url, dependencyGraph)
  L.dependencyGraphAddMod(dependencyGraph, mod)

  builtinInt(mod)
  builtinFloat(mod)
  builtinKeyword(mod)
  builtinBool(mod)
  builtinSymbol(mod)
  builtinString(mod)
  builtinValue(mod)
  builtinList(mod)
  builtinConsole(mod)
  builtinVoid(mod)
  builtinRandom(mod)
  builtinSet(mod)
  builtinHash(mod)
  builtinAssert(mod)
  builtinError(mod)
  builtinType(mod)

  const code = fs.readFileSync(file, "utf-8")
  L.prepareCode(mod, code)

  return mod
}
