import {
  callWithFile,
  fileRead,
  openInputFile,
} from "@xieyuheng/helpers.js/file"
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

export const builtinModPath = Path.join(
  currentDir,
  "../../../lib/builtin/index.meta",
)

export function loadBuiltinMod(project: M.Project): M.Mod {
  const found = M.projectLookupMod(project, builtinModPath)
  if (found !== undefined) return found

  const mod = M.createMod(builtinModPath, project)
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

  callWithFile(openInputFile(builtinModPath), (file) => {
    const code = fileRead(file)
    M.prepareCode(mod, code)
  })

  return mod
}
