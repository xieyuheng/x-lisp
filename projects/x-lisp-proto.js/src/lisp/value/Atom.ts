export type AtomValue =
  | SymbolValue
  | HashtagValue
  | StringValue
  | IntValue
  | FloatValue

export type SymbolValue = {
  kind: "Symbol"
  content: string
}

export function SymbolValue(content: string): SymbolValue {
  return {
    kind: "Symbol",
    content,
  }
}

export type StringValue = {
  kind: "String"
  content: string
}

export function StringValue(content: string): StringValue {
  return {
    kind: "String",
    content,
  }
}

export type HashtagValue = {
  kind: "Hashtag"
  content: string
}

export function HashtagValue(content: string): HashtagValue {
  return {
    kind: "Hashtag",
    content,
  }
}

export type IntValue = {
  kind: "Int"
  content: bigint
}

export function IntValue(content: bigint): IntValue {
  return {
    kind: "Int",
    content,
  }
}

export type FloatValue = {
  kind: "Float"
  content: number
}

export function FloatValue(content: number): FloatValue {
  return {
    kind: "Float",
    content,
  }
}
