import fs from "node:fs"
import Path from "node:path"
import { fileURLToPath } from "node:url"
import * as M from "../index.ts"
import { builtinAssert } from "./builtinAssert.ts"
import { builtinBool } from "./builtinBool.ts"
import { builtinError } from "./builtinError.ts"
import { builtinFile } from "./builtinFile.ts"
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

const currentDir = Path.dirname(fileURLToPath(import.meta.url))

export function loadBuiltinMod(project: M.Project): M.Mod {
  const builtinPath = Path.join(currentDir, "../../../../meta-builtin.meta/src")
  const modName = "builtin"

  const found = M.projectLookupMod(project, modName)
  if (found !== undefined) return found

  const mod = M.createMod(modName, project)
  M.projectAddMod(project, mod)

  builtinInt(mod)
  builtinFloat(mod)
  builtinKeyword(mod)
  builtinBool(mod)
  builtinSymbol(mod)
  builtinString(mod)
  builtinValue(mod)
  builtinList(mod)
  builtinFile(mod)
  builtinVoid(mod)
  builtinRandom(mod)
  builtinSet(mod)
  builtinHash(mod)
  builtinAssert(mod)
  builtinError(mod)
  builtinType(mod)

  for (const path of fs.readdirSync(builtinPath, {
    encoding: "utf-8",
    recursive: true,
  })) {
    if (path.endsWith(".meta")) {
      M.projectLoadModFragment(project, Path.join(builtinPath, path))
    }
  }

  return mod
}
