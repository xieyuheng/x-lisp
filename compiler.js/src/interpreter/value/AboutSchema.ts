import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Attributes, Value } from "./Value.ts"

export type AboutSchema = Arrow | VariadicArrow | The | Tau | Polymorphic

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

export type VariadicArrow = {
  kind: "VariadicArrow"
  argSchema: Value
  retSchema: Value
}

export function VariadicArrow(
  argSchema: Value,
  retSchema: Value,
): VariadicArrow {
  return {
    kind: "VariadicArrow",
    argSchema,
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

export type Polymorphic = {
  kind: "Polymorphic"
  mod: Mod
  env: Env
  parameters: Array<string>
  schema: Exp
}

export function Polymorphic(
  mod: Mod,
  env: Env,
  parameters: Array<string>,
  schema: Exp,
): Polymorphic {
  return {
    kind: "Polymorphic",
    mod,
    env,
    parameters,
    schema,
  }
}
