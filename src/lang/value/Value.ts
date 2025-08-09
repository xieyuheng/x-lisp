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
  | Arrow
  | Claimed

export type Tael = {
  kind: "Tael"
  elements: Array<Value>
  attributes: Attributes
}

export function Tael(elements: Array<Value>, attributes: Attributes): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
  }
}

export type Lambda = {
  kind: "Lambda"
  mod: Mod
  env: Env
  parameters: Array<string>
  body: Exp
  definedName?: string
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

export type CurriedLambda = {
  kind: "CurriedLambda"
  lambda: Lambda
  args: Array<Value>
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

export type PrimFn = {
  kind: "PrimFn"
  name: string
  arity: number
  fn: ValueFn
}

export type ValueFn = (...args: Array<Value>) => Value

export function PrimFn(name: string, arity: number, fn: ValueFn): PrimFn {
  return {
    kind: "PrimFn",
    name,
    arity,
    fn,
  }
}

export type CurriedPrimFn = {
  kind: "CurriedPrimFn"
  primFn: PrimFn
  args: Array<Value>
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

export type Void = {
  kind: "Void"
}

export function Void(): Void {
  return {
    kind: "Void",
  }
}

export type Arrow = {
  kind: "Arrow"
  argSchemas: Array<Value>
  retSchema: Value
}

export function Arrow(argSchemas: Array<Value>, retSchema: Value): Arrow {
  return {
    kind: "Arrow",
    argSchemas,
    retSchema,
  }
}

export type Claimed = {
  kind: "Claimed"
  value: Value
  schema: Value
}

export function Claimed(value: Value, schema: Value): Claimed {
  return {
    kind: "Claimed",
    value,
    schema,
  }
}
