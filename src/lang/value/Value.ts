import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Atom } from "./Atom.ts"
import { type AboutData } from "./Data.ts"

export type Attributes = Record<string, Value>

export type Value =
  | Atom
  | Null
  | Tael
  | Lambda
  | Thunk
  | Lazy
  | LambdaLazy
  | PrimitiveFunction
  | PrimitiveThunk
  | Void
  | AboutData
  | Arrow
  | The
  | Curried
  | Tau

export type Null = {
  kind: "Null"
}

export function Null(): Null {
  return {
    kind: "Null",
  }
}

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

export type Thunk = {
  kind: "Thunk"
  mod: Mod
  env: Env
  body: Exp
}

export function Thunk(mod: Mod, env: Env, body: Exp): Thunk {
  return {
    kind: "Thunk",
    mod,
    env,
    body,
  }
}

export type Lazy = {
  kind: "Lazy"
  mod: Mod
  env: Env
  exp: Exp
  cachedValue?: Value
}

export function Lazy(mod: Mod, env: Env, exp: Exp): Lazy {
  return {
    kind: "Lazy",
    mod,
    env,
    exp,
  }
}

export type LambdaLazy = {
  kind: "LambdaLazy"
  mod: Mod
  env: Env
  parameters: Array<string>
  body: Exp
}

export function LambdaLazy(
  mod: Mod,
  env: Env,
  parameters: Array<string>,
  body: Exp,
): LambdaLazy {
  return {
    kind: "LambdaLazy",
    mod,
    env,
    parameters,
    body,
  }
}

export type PrimitiveFunction = {
  kind: "PrimitiveFunction"
  name: string
  arity: number
  fn: ValueFunction
}

export type ValueFunction = (...args: Array<Value>) => Value

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

export type PrimitiveThunk = {
  kind: "PrimitiveThunk"
  name: string
  fn: ValueThunk
}

export type ValueThunk = () => Value

export function PrimitiveThunk(name: string, fn: ValueThunk): PrimitiveThunk {
  return {
    kind: "PrimitiveThunk",
    name,
    fn,
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

export type The = {
  kind: "The"
  schema: Value
  value: Value
}

export function The(schema: Value, value: Value): The {
  return {
    kind: "The",
    schema,
    value,
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

export type Tau = {
  kind: "Tau"
  elementSchemas: Array<Value>
  attributeSchemas: Attributes
}

export function Tau(
  elementSchemas: Array<Value>,
  attributeSchemas: Attributes,
): Tau {
  return {
    kind: "Tau",
    elementSchemas,
    attributeSchemas,
  }
}
