import { createMod, type Mod } from "../mod/index.ts"

const globalPreludeMod = createMod(new URL("prelude:occam"))

let isInitialized = false

export function usePreludeMod(): Mod {
  if (!isInitialized) {
    //

    isInitialized = true
  }

  return globalPreludeMod
}
