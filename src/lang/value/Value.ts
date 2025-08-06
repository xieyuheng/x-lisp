import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"

export type Attributes = Record<string, Value>

export type Value = Atom | Tael | Lambda | Lazy | PrimFn | CurriedPrimFn | Void

export type Atom = Bool | Symbol | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean }
export type Symbol = { kind: "Symbol"; content: string }
export type String = { kind: "String"; content: string }
export type Int = { kind: "Int"; content: number }
export type Float = { kind: "Float"; content: number }

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

export type Void = {
  kind: "Void"
}

export function Bool(content: boolean): Bool {
  return {
    kind: "Bool",
    content,
  }
}

export function Symbol(content: string): Symbol {
  return {
    kind: "Symbol",
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

export function Tael(elements: Array<Value>, attributes: Attributes): Tael {
  return {
    kind: "Tael",
    elements,
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

export function Void(): Void {
  return {
    kind: "Void",
  }
}
