import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Atom } from "./Atom.ts"

export type Value = Atom | Tael | Lambda

export type Attributes = Record<string, Value>
export type Tael = {
  kind: "Tael"
  content: Array<Value>
  attributes: Attributes
}

export type Lambda = {
  kind: "Lambda"
  mod: Mod
  env: Env
  name: string
  ret: Exp
  definedName?: string
}

export function Tael(content: Array<Value>, attributes: Attributes): Tael {
  return {
    kind: "Tael",
    content,
    attributes,
  }
}

export function List(content: Array<Value>): Tael {
  return {
    kind: "Tael",
    content,
    attributes: {},
  }
}

export function Record(attributes: Attributes): Tael {
  return {
    kind: "Tael",
    content: [],
    attributes,
  }
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
