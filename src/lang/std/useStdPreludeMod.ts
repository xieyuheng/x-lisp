import { createMod, type Mod } from "../mod/index.ts"

let mod: Mod | undefined = undefined

export function useStdPreludeMod(): Mod {
  if (mod) return mod

  const url = new URL("todo:")
  mod = createMod(url)

  return mod
}
