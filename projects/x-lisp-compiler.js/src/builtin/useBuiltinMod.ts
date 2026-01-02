import * as L from "../lisp/index.ts"
import { createBuiltinMod } from "./createBuiltinMod.ts"

let globalBuiltinMod: L.Mod | undefined = undefined

export function useBuiltinMod(): L.Mod {
  if (globalBuiltinMod === undefined) {
    console.log('hihihi')
    globalBuiltinMod = createBuiltinMod()
  }

  return globalBuiltinMod
}
