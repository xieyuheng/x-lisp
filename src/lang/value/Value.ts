import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"

export type Value = Atom | Lambda

export type Atom = Bool | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean }
export type String = { kind: "String"; content: string }
export type Int = { kind: "Int"; content: number }
export type Float = { kind: "Float"; content: number }

export type Lambda = {
  kind: "Lambda"
  mod: Mod
  env: Env
  name: string
  ret: Exp
  definedName?: string
}

export function Bool(content: boolean): Bool {
  return {
    kind: "Bool",
    content,
  }
}

export function String(content: string): String {
  return {
    kind: "String",
    content,
  }
}

export function Int(content: number): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
  }
}

export function Float(content: number): Float {
  return {
    kind: "Float",
    content,
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
