import type { Mod } from "../mod/index.ts"

export type TypeConstructor = {
  mod: Mod
  name: string
  size: () => number
}
