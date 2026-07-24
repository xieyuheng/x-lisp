import * as M from "../index.ts"

// - note: evaluate implement auto-currying at runtime,
//   by nested CurryValue instead of flat ClosureValue

export type Value = TypeValue | CurryValue | DefinitionValue

export type TypeValue = {
  kind: "TypeValue"
  type: M.Type
}

export function TypeValue(type: M.Type): TypeValue {
  return {
    kind: "TypeValue",
    type,
  }
}

export function isTypeValue(value: Value): value is TypeValue {
  return value.kind === "TypeValue"
}

export function asTypeValue(value: Value): TypeValue {
  if (isTypeValue(value)) return value
  throw new Error(`[asTypeValue] fail on: ${value.kind}`)
}

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
  return {
    kind: "CurryValue",
    target,
    arity,
    args,
  }
}

export function isCurryValue(value: Value): value is CurryValue {
  return value.kind === "CurryValue"
}

export function asCurryValue(value: Value): CurryValue {
  if (isCurryValue(value)) return value
  throw new Error(`[asCurryValue] fail on: ${value.kind}`)
}

export type DefinitionValue = {
  kind: "DefinitionValue"
  definition: M.Definition
}

export function DefinitionValue(definition: M.Definition): DefinitionValue {
  return {
    kind: "DefinitionValue",
    definition,
  }
}

export function isDefinitionValue(value: Value): value is DefinitionValue {
  return value.kind === "DefinitionValue"
}

export function asDefinitionValue(value: Value): DefinitionValue {
  if (isDefinitionValue(value)) return value
  throw new Error(`[asDefinitionValue] fail on: ${value.kind}`)
}
