import * as B from "../../backend/index.ts"
import { type Mod } from "../mod/index.ts"

export function ExplicateControlPass(mod: Mod): B.Mod {
  const backendMod = B.createMod(mod.url)
  return backendMod
}
