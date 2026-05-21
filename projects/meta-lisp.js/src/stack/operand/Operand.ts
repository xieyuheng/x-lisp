import { type SourceLocation } from "@xieyuheng/sexp.js"

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
  location: SourceLocation
}

export function SymbolOperand(
  content: string,
  location: SourceLocation,
): SymbolOperand {
  return {
    kind: "SymbolOperand",
    content,
    location,
  }
}

export type StringOperand = {
  kind: "StringOperand"
  content: string
  location: SourceLocation
}

export function StringOperand(
  content: string,
  location: SourceLocation,
): StringOperand {
  return {
    kind: "StringOperand",
    content,
    location,
  }
}

export type KeywordOperand = {
  kind: "KeywordOperand"
  content: string
  location: SourceLocation
}

export function KeywordOperand(
  content: string,
  location: SourceLocation,
): KeywordOperand {
  return {
    kind: "KeywordOperand",
    content,
    location,
  }
}

export type IntOperand = {
  kind: "IntOperand"
  content: bigint
  location: SourceLocation
}

export function IntOperand(
  content: bigint,
  location: SourceLocation,
): IntOperand {
  return {
    kind: "IntOperand",
    content,
    location,
  }
}

export type FloatOperand = {
  kind: "FloatOperand"
  content: number
  location: SourceLocation
}

export function FloatOperand(
  content: number,
  location: SourceLocation,
): FloatOperand {
  return {
    kind: "FloatOperand",
    content,
    location,
  }
}

export type VarOperand = {
  kind: "VarOperand"
  name: string
  location: SourceLocation
}

export function VarOperand(name: string, location: SourceLocation): VarOperand {
  return {
    kind: "VarOperand",
    name,
    location,
  }
}
