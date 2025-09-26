import type { Attributes, Value } from "./Value.ts"

export type AboutSchema = Arrow | The | Tau | Polymorphic

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
  parameters: Array<string>
  schema: Value
}

export function Polymorphic(
  parameters: Array<string>,
  schema: Value,
): Polymorphic {
  return {
    kind: "Polymorphic",
    parameters,
    schema,
  }
}
