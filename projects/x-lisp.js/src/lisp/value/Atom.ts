export type AtomValue =
  | BoolValue
  | VoidValue
  | SymbolValue
  | KeywordValue
  | StringValue
  | IntValue
  | FloatValue

export type BoolValue = {
  kind: "BoolValue"
  content: boolean
}

export function BoolValue(content: boolean): BoolValue {
  return {
    kind: "BoolValue",
    content,
  }
}

export type VoidValue = {
  kind: "VoidValue"
  content: undefined
}

export function VoidValue(): VoidValue {
  return {
    kind: "VoidValue",
    content: undefined,
  }
}

export type SymbolValue = {
  kind: "SymbolValue"
  content: string
}

export function SymbolValue(content: string): SymbolValue {
  return {
    kind: "SymbolValue",
    content,
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

export type KeywordValue = {
  kind: "KeywordValue"
  content: string
}

export function KeywordValue(content: string): KeywordValue {
  return {
    kind: "KeywordValue",
    content,
  }
}

export type IntValue = {
  kind: "IntValue"
  content: bigint
}

export function IntValue(content: bigint): IntValue {
  return {
    kind: "IntValue",
    content,
  }
}

export type FloatValue = {
  kind: "FloatValue"
  content: number
}

export function FloatValue(content: number): FloatValue {
  return {
    kind: "FloatValue",
    content,
  }
}
