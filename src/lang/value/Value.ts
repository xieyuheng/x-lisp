import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Atom } from "./Atom.ts"

export type Value = Atom | Lambda

export type Lambda = {
  kind: "Lambda"
  mod: Mod
  env: Env
  name: string
  ret: Exp
  definedName?: string
}

export function Lambda(mod: Mod, env: Env, name: string, ret: Exp): Lambda {
  return {
    kind: "Lambda",
    mod,
    env,
    name,
    ret,
  }
}
