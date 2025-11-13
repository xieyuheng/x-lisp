import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Patterns from "../pattern/index.ts"
import { type AboutData } from "./AboutData.ts"
import { type AboutSchema } from "./AboutSchema.ts"
import { type Atom } from "./Atom.ts"
import { type Hash } from "./Hash.ts"
import { type Set } from "./Set.ts"

export type Attributes = Record<string, Value>

export type Value =
  | Atom
  | Tael
  | Set
  | Hash
  | Closure
  | VariadicClosure
  | NullaryClosure
  | PrimitiveFunction
  | PrimitiveNullaryFunction
  | Curry
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

export type Closure = {
  kind: "Closure"
  mod: Mod
  env: Env
  parameters: Array<Exp>
  body: Exp
  meta?: Meta
}

export function Closure(
  mod: Mod,
  env: Env,
  parameters: Array<Exp>,
  body: Exp,
  meta?: Meta,
): Closure {
  return {
    kind: "Closure",
    mod,
    env,
    parameters,
    body,
    meta,
  }
}

export type VariadicClosure = {
  kind: "VariadicClosure"
  mod: Mod
  env: Env
  variadicParameter: string
  body: Exp
  meta?: Meta
}

export function VariadicClosure(
  mod: Mod,
  env: Env,
  variadicParameter: string,
  body: Exp,
  meta?: Meta,
): VariadicClosure {
  return {
    kind: "VariadicClosure",
    mod,
    env,
    variadicParameter,
    body,
    meta,
  }
}

export type NullaryClosure = {
  kind: "NullaryClosure"
  mod: Mod
  env: Env
  body: Exp
  meta?: Meta
}

export function NullaryClosure(
  mod: Mod,
  env: Env,
  body: Exp,
  meta?: Meta,
): NullaryClosure {
  return {
    kind: "NullaryClosure",
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

export type Curry = {
  kind: "Curry"
  target: Value
  arity: number
  args: Array<Value>
}

export function Curry(target: Value, arity: number, args: Array<Value>): Curry {
  return {
    kind: "Curry",
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
