import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Atom } from "./Atom.ts"

export type Value = Atom | Tael | Lambda | Lazy | PrimFn | CurriedPrimFn

export type Attributes = Record<string, Value>

export type Tael = {
  kind: "Tael"
  elements: Array<Value>
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

export type Lazy = {
  kind: "Lazy"
  mod: Mod
  env: Env
  exp: Exp
  value?: Value
}

export type ValueFn = (...args: Array<Value>) => Value

export type PrimFn = {
  kind: "PrimFn"
  name: string
  arity: number
  fn: ValueFn
}

export type CurriedPrimFn = {
  kind: "CurriedPrimFn"
  primFn: PrimFn
  args: Array<Value>
}

export function Tael(elements: Array<Value>, attributes: Attributes): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
  }
}

export function List(elements: Array<Value>): Tael {
  return {
    kind: "Tael",
    elements,
    attributes: {},
  }
}

export function Record(attributes: Attributes): Tael {
  return {
    kind: "Tael",
    elements: [],
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

export function Lazy(mod: Mod, env: Env, exp: Exp): Lazy {
  return {
    kind: "Lazy",
    mod,
    env,
    exp,
  }
}

export function PrimFn(name: string, arity: number, fn: ValueFn): PrimFn {
  return {
    kind: "PrimFn",
    name,
    arity,
    fn,
  }
}

export function CurriedPrimFn(
  primFn: PrimFn,
  args: Array<Value>,
): CurriedPrimFn {
  return {
    kind: "CurriedPrimFn",
    primFn,
    args,
  }
}
