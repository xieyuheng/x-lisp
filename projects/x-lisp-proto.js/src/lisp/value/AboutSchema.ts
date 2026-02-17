import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Attributes, type Value } from "./Value.ts"

export type AboutSchema =
  | ArrowValue
  | VariadicArrowValue
  | TheValue
  | TauValue
  | PolymorphicValue

export type ArrowValue = {
  kind: "Arrow"
  argSchemas: Array<Value>
  retSchema: Value
}

export function ArrowValue(
  argSchemas: Array<Value>,
  retSchema: Value,
): ArrowValue {
  return {
    kind: "Arrow",
    argSchemas,
    retSchema,
  }
}

export type VariadicArrowValue = {
  kind: "VariadicArrow"
  argSchema: Value
  retSchema: Value
}

export function VariadicArrowValue(
  argSchema: Value,
  retSchema: Value,
): VariadicArrowValue {
  return {
    kind: "VariadicArrow",
    argSchema,
    retSchema,
  }
}

export type TheValue = {
  kind: "The"
  schema: Value
  value: Value
}

export function TheValue(schema: Value, value: Value): TheValue {
  return {
    kind: "The",
    schema,
    value,
  }
}

export type TauValue = {
  kind: "Tau"
  elementSchemas: Array<Value>
  attributeSchemas: Attributes
}

export function TauValue(
  elementSchemas: Array<Value>,
  attributeSchemas: Attributes,
): TauValue {
  return {
    kind: "Tau",
    elementSchemas,
    attributeSchemas,
  }
}

export type PolymorphicValue = {
  kind: "Polymorphic"
  mod: Mod
  env: Env
  parameters: Array<string>
  schema: Exp
}

export function PolymorphicValue(
  mod: Mod,
  env: Env,
  parameters: Array<string>,
  schema: Exp,
): PolymorphicValue {
  return {
    kind: "Polymorphic",
    mod,
    env,
    parameters,
    schema,
  }
}
