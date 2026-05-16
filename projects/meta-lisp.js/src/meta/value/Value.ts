import type { Definition } from "../definition/index.ts"
import type { Type } from "../type/Type.ts"

export type Value = TypeValue | CurryValue | DefinitionValue

// TypeValue

export type TypeValue = {
  kind: "TypeValue"
  type: Type
}

export function TypeValue(type: Type): TypeValue {
  return { kind: "TypeValue", type }
}

export function isTypeValue(value: Value): value is TypeValue {
  return value.kind === "TypeValue"
}

export function asTypeValue(value: Value): TypeValue {
  if (isTypeValue(value)) return value
  throw new Error(`[asTypeValue] fail on: ${value.kind}`)
}

// CurryValue

export type CurryValue = {
  kind: "CurryValue"
  target: Value
  arity: number
  args: Array<Value>
}

export function CurryValue(
  target: Value,
  arity: number,
  args: Array<Value>,
): CurryValue {
  return { kind: "CurryValue", target, arity, args }
}

export function isCurryValue(value: Value): value is CurryValue {
  return value.kind === "CurryValue"
}

export function asCurryValue(value: Value): CurryValue {
  if (isCurryValue(value)) return value
  throw new Error(`[asCurryValue] fail on: ${value.kind}`)
}

// DefinitionValue

export type DefinitionValue = {
  kind: "DefinitionValue"
  definition: Definition
}

export function DefinitionValue(definition: Definition): DefinitionValue {
  return { kind: "DefinitionValue", definition }
}

export function isDefinitionValue(value: Value): value is DefinitionValue {
  return value.kind === "DefinitionValue"
}

export function asDefinitionValue(value: Value): DefinitionValue {
  if (isDefinitionValue(value)) return value
  throw new Error(`[asDefinitionValue] fail on: ${value.kind}`)
}
