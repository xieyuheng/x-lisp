import * as L from "../lisp/index.ts"

export function createBuiltinMod(): L.Mod {
  const url = new URL("builtin:")
  const mod = L.createMod(url, new Map())

  //

  return mod
}
