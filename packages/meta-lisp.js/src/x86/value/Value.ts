import type { Type } from "../type/index.ts"

export type Value =
  | IntValue
  | StringValue
  | AddressValue
  | StructValue
  | PointerValue
  | TypeValue
  | ArrayValue

export type IntValue = {
  kind: "IntValue"
  value: bigint
}

export function IntValue(value: bigint): IntValue {
  return {
    kind: "IntValue",
    value,
  }
}

export type StringValue = {
  kind: "StringValue"
  content: string
}

export function StringValue(content: string): StringValue {
  return {
    kind: "StringValue",
    content,
  }
}

export type AddressValue = {
  kind: "AddressValue"
  name: string
}

export function AddressValue(name: string): AddressValue {
  return {
    kind: "AddressValue",
    name,
  }
}

export type StructValue = {
  kind: "StructValue"
  name: string
  fields: Map<string, Value>
}

export function StructValue(
  name: string,
  fields: Map<string, Value>,
): StructValue {
  return {
    kind: "StructValue",
    name,
    fields,
  }
}

export type PointerValue = {
  kind: "PointerValue"
  target: Value
}

export function PointerValue(target: Value): PointerValue {
  return {
    kind: "PointerValue",
    target,
  }
}

export type TypeValue = {
  kind: "TypeValue"
  type: Type
}

export function TypeValue(type: Type): TypeValue {
  return {
    kind: "TypeValue",
    type,
  }
}

export function isTypeValue(value: Value): value is TypeValue {
  return value.kind === "TypeValue"
}

export type ArrayValue = {
  kind: "ArrayValue"
  elements: Array<Value>
}

export function ArrayValue(elements: Array<Value>): ArrayValue {
  return {
    kind: "ArrayValue",
    elements,
  }
}
