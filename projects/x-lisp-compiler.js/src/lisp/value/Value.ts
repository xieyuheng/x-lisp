import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type AboutSchema } from "./AboutSchema.ts"
import { type AtomValue } from "./Atom.ts"
import { type HashValue } from "./Hash.ts"
import { type SetValue } from "./Set.ts"

export type Attributes = Record<string, Value>

export type Value =
  | AtomValue
  | TaelValue
  | SetValue
  | HashValue
  | ClosureValue
  | VariadicClosureValue
  | NullaryClosureValue
  | PrimitiveFunctionValue
  | PrimitiveNullaryFunctionValue
  | CurryValue
  | AboutSchema

export type TaelValue = {
  kind: "Tael"
  elements: Array<Value>
  attributes: Attributes
}

export function TaelValue(
  elements: Array<Value>,
  attributes: Attributes,
): TaelValue {
  return {
    kind: "Tael",
    elements,
    attributes,
  }
}

export type ClosureValue = {
  kind: "Closure"
  mod: Mod
  env: Env
  parameters: Array<Exp>
  body: Exp
  meta?: Meta
}

export function ClosureValue(
  mod: Mod,
  env: Env,
  parameters: Array<Exp>,
  body: Exp,
  meta?: Meta,
): ClosureValue {
  return {
    kind: "Closure",
    mod,
    env,
    parameters,
    body,
    meta,
  }
}

export type VariadicClosureValue = {
  kind: "VariadicClosure"
  mod: Mod
  env: Env
  variadicParameter: string
  body: Exp
  meta?: Meta
}

export function VariadicClosureValue(
  mod: Mod,
  env: Env,
  variadicParameter: string,
  body: Exp,
  meta?: Meta,
): VariadicClosureValue {
  return {
    kind: "VariadicClosure",
    mod,
    env,
    variadicParameter,
    body,
    meta,
  }
}

export type NullaryClosureValue = {
  kind: "NullaryClosure"
  mod: Mod
  env: Env
  body: Exp
  meta?: Meta
}

export function NullaryClosureValue(
  mod: Mod,
  env: Env,
  body: Exp,
  meta?: Meta,
): NullaryClosureValue {
  return {
    kind: "NullaryClosure",
    mod,
    env,
    body,
    meta,
  }
}

export type ValueFunction = (...args: Array<Value>) => Value

export type PrimitiveFunctionValue = {
  kind: "PrimitiveFunction"
  name: string
  arity: number
  fn: ValueFunction
}

export function PrimitiveFunctionValue(
  name: string,
  arity: number,
  fn: ValueFunction,
): PrimitiveFunctionValue {
  return {
    kind: "PrimitiveFunction",
    name,
    arity,
    fn,
  }
}

export type PrimitiveNullaryFunctionValue = {
  kind: "PrimitiveNullaryFunction"
  name: string
  fn: ValueNullaryFunction
}

export type ValueNullaryFunction = () => Value

export function PrimitiveNullaryFunctionValue(
  name: string,
  fn: ValueNullaryFunction,
): PrimitiveNullaryFunctionValue {
  return {
    kind: "PrimitiveNullaryFunction",
    name,
    fn,
  }
}

export type CurryValue = {
  kind: "Curry"
  target: Value
  arity: number
  args: Array<Value>
}

export function CurryValue(
  target: Value,
  arity: number,
  args: Array<Value>,
): CurryValue {
  return {
    kind: "Curry",
    target,
    arity,
    args,
  }
}
