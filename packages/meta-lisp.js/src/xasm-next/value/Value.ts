export type Value =
  | IntValue
  | StringValue
  | LabelValue
  | StructValue
  | PointerValue

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
