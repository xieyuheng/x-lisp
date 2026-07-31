export type Operand =
  | SymbolOperand
  | KeywordOperand
  | StringOperand
  | IntOperand
  | FloatOperand
  | VarOperand

export type SymbolOperand = {
  kind: "SymbolOperand"
  content: string
}

export function SymbolOperand(content: string): SymbolOperand {
  return {
    kind: "SymbolOperand",
    content,
  }
}

export type StringOperand = {
  kind: "StringOperand"
  content: string
}

export function StringOperand(content: string): StringOperand {
  return {
    kind: "StringOperand",
    content,
  }
}

export type KeywordOperand = {
  kind: "KeywordOperand"
  content: string
}

export function KeywordOperand(content: string): KeywordOperand {
  return {
    kind: "KeywordOperand",
    content,
  }
}

export type IntOperand = {
  kind: "IntOperand"
  content: bigint
}

export function IntOperand(content: bigint): IntOperand {
  return {
    kind: "IntOperand",
    content,
  }
}

export type FloatOperand = {
  kind: "FloatOperand"
  content: number
}

export function FloatOperand(content: number): FloatOperand {
  return {
    kind: "FloatOperand",
    content,
  }
}

export type VarOperand = {
  kind: "VarOperand"
  name: string
}

export function VarOperand(name: string): VarOperand {
  return {
    kind: "VarOperand",
    name,
  }
}
