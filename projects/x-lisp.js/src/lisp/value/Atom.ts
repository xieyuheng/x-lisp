export type AtomValue =
  | SymbolValue
  | HashtagValue
  | StringValue
  | IntValue
  | FloatValue

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

export type HashtagValue = {
  kind: "HashtagValue"
  content: string
}

export function HashtagValue(content: string): HashtagValue {
  return {
    kind: "HashtagValue",
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
