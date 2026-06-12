import type { Type, TypeConstructor } from "../type/index.ts"

export type Value =
  | IntValue
  | StringValue
  | LabelValue
  | StructValue
  | PointerValue
  | TypeValue
  | TypeConstructorValue

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

export type LabelValue = {
  kind: "LabelValue"
  name: string
  path: Array<string>
}

export function LabelValue(name: string, path: Array<string>): LabelValue {
  return {
    kind: "LabelValue",
    name,
    path,
  }
}

export type StructValue = {
  kind: "StructValue"
  name: string | undefined
  fields: Map<string, Value>
}

export function StructValue(
  name: string | undefined,
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

export function asTypeValue(value: Value): TypeValue {
  if (value.kind !== "TypeValue") {
    let message = `expected TypeValue, got: ${value.kind}`
    throw new Error(message)
  }
  return value
}

export type TypeConstructorValue = {
  kind: "TypeConstructorValue"
  typeConstructor: TypeConstructor
}

export function TypeConstructorValue(
  typeConstructor: TypeConstructor,
): TypeConstructorValue {
  return {
    kind: "TypeConstructorValue",
    typeConstructor,
  }
}

export function isTypeConstructorValue(
  value: Value,
): value is TypeConstructorValue {
  return value.kind === "TypeConstructorValue"
}
