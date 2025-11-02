import * as X from "@xieyuheng/x-sexp.js"
import { arrayConcat } from "../../../helpers/array/arrayConcat.ts"
import { arrayUnzip } from "../../../helpers/array/arrayUnzip.ts"
import { stringToSubscript } from "../../../helpers/string/stringToSubscript.ts"
import type { Definition } from "../definition/index.ts"
import * as Definitions from "../definition/index.ts"
import type { Exp } from "../exp/index.ts"
import * as Exps from "../exp/index.ts"
import * as B from "../../backend/index.ts"
import { formatExp } from "../format/index.ts"
import { modMapDefinition, type Mod } from "../mod/index.ts"

export function ExplicateControlPass(mod: Mod): B.Mod {
  const backendMod = B.createMod(mod.url)
  return backendMod
}
