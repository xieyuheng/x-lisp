import { type TokenMeta } from "@xieyuheng/x-sexp.js"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Patterns from "../pattern/index.ts"
import { type AboutData } from "./AboutData.ts"
import { type AboutSchema } from "./AboutSchema.ts"
import { type Atom } from "./Atom.ts"
import { type Hash } from "./Hash.ts"
import { type Set } from "./Set.ts"

export type Meta = TokenMeta

export type Attributes = Record<string, Value>

export type Value =
  | Atom
  | Tael
  | Set
  | Hash
  | Lambda
  | VariadicLambda
  | NullaryLambda
  | PrimitiveFunction
  | PrimitiveNullaryFunction
  | Curried
  | Pattern
  | AboutData
  | AboutSchema

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
  parameters: Array<Exp>
  body: Exp
  meta?: Meta
}

export function Lambda(
  mod: Mod,
  env: Env,
  parameters: Array<Exp>,
  body: Exp,
  meta?: Meta,
): Lambda {
  return {
    kind: "Lambda",
    mod,
    env,
    parameters,
    body,
    meta,
  }
}

export type VariadicLambda = {
  kind: "VariadicLambda"
  mod: Mod
  env: Env
  variadicParameter: string
  body: Exp
  meta?: Meta
}

export function VariadicLambda(
  mod: Mod,
  env: Env,
  variadicParameter: string,
  body: Exp,
  meta?: Meta,
): VariadicLambda {
  return {
    kind: "VariadicLambda",
    mod,
    env,
    variadicParameter,
    body,
    meta,
  }
}

export type NullaryLambda = {
  kind: "NullaryLambda"
  mod: Mod
  env: Env
  body: Exp
  meta?: Meta
}

export function NullaryLambda(
  mod: Mod,
  env: Env,
  body: Exp,
  meta?: Meta,
): NullaryLambda {
  return {
    kind: "NullaryLambda",
    mod,
    env,
    body,
    meta,
  }
}

export type ValueFunction = (...args: Array<Value>) => Value

export type PrimitiveFunction = {
  kind: "PrimitiveFunction"
  name: string
  arity: number
  fn: ValueFunction
}

export function PrimitiveFunction(
  name: string,
  arity: number,
  fn: ValueFunction,
): PrimitiveFunction {
  return {
    kind: "PrimitiveFunction",
    name,
    arity,
    fn,
  }
}

export type PrimitiveNullaryFunction = {
  kind: "PrimitiveNullaryFunction"
  name: string
  fn: ValueNullaryFunction
}

export type ValueNullaryFunction = () => Value

export function PrimitiveNullaryFunction(
  name: string,
  fn: ValueNullaryFunction,
): PrimitiveNullaryFunction {
  return {
    kind: "PrimitiveNullaryFunction",
    name,
    fn,
  }
}

export type Curried = {
  kind: "Curried"
  target: Value
  arity: number
  args: Array<Value>
}

export function Curried(
  target: Value,
  arity: number,
  args: Array<Value>,
): Curried {
  return {
    kind: "Curried",
    target,
    arity,
    args,
  }
}

export type Pattern = {
  kind: "Pattern"
  pattern: Patterns.Pattern
}

export function Pattern(pattern: Patterns.Pattern): Pattern {
  return {
    kind: "Pattern",
    pattern,
  }
}
