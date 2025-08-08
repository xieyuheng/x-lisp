import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Atom } from "./Atom.ts"
import { type AboutData } from "./Data.ts"

export type Attributes = Record<string, Value>

export type Value =
  | Atom
  | Tael
  | Lambda
  | CurriedLambda
  | PrimFn
  | CurriedPrimFn
  | Void
  | AboutData

export type Tael = {
  kind: "Tael"
  elements: Array<Value>
  attributes: Attributes
}

export type Lambda = {
  kind: "Lambda"
  mod: Mod
  env: Env
  parameters: Array<string>
  body: Exp
  definedName?: string
}

export type CurriedLambda = {
  kind: "CurriedLambda"
  lambda: Lambda
  args: Array<Value>
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

export function Tael(elements: Array<Value>, attributes: Attributes): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
  }
}

export function Lambda(
  mod: Mod,
  env: Env,
  parameters: Array<string>,
  body: Exp,
): Lambda {
  return {
    kind: "Lambda",
    mod,
    env,
    parameters,
    body,
  }
}

export function CurriedLambda(
  lambda: Lambda,
  args: Array<Value>,
): CurriedLambda {
  return {
    kind: "CurriedLambda",
    lambda,
    args,
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
