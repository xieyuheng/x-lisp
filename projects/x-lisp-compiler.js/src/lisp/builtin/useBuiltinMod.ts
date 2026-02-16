import * as L from "../index.ts"
import { createBuiltinMod } from "./createBuiltinMod.ts"

let globalBuiltinMod: L.Mod | undefined = undefined

export function useBuiltinMod(): L.Mod {
  if (globalBuiltinMod === undefined) {
    globalBuiltinMod = createBuiltinMod()
  }

  return globalBuiltinMod
}
