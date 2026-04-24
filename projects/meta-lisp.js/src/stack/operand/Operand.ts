import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Operand = Symbol | Keyword | String | Int | Float | Var

export type Symbol = {
  kind: "Symbol"
  content: string
  location?: SourceLocation
}

export function Symbol(content: string, location?: SourceLocation): Symbol {
  return {
    kind: "Symbol",
    content,
    location,
  }
}

export type String = {
  kind: "String"
  content: string
  location?: SourceLocation
}

export function String(content: string, location?: SourceLocation): String {
  return {
    kind: "String",
    content,
    location,
  }
}

export type Keyword = {
  kind: "Keyword"
  content: string
  location?: SourceLocation
}

export function Keyword(content: string, location?: SourceLocation): Keyword {
  return {
    kind: "Keyword",
    content,
    location,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  location?: SourceLocation
}

export function Int(content: bigint, location?: SourceLocation): Int {
  return {
    kind: "Int",
    content,
    location,
  }
}

export type Float = {
  kind: "Float"
  content: number
  location?: SourceLocation
}

export function Float(content: number, location?: SourceLocation): Float {
  return {
    kind: "Float",
    content,
    location,
  }
}

export type Var = {
  kind: "Var"
  name: string
  location?: SourceLocation
}

export function Var(name: string, location?: SourceLocation): Var {
  return {
    kind: "Var",
    name,
    location,
  }
}
