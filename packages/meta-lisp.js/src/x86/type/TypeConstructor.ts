import type { Mod } from "../mod/index.ts"
import type { Type } from "./Type.ts"

export type TypeConstructor = {
  mod: Mod
  name: string
  parameters: string[]
  size: (argTypes: Type[]) => number
}
