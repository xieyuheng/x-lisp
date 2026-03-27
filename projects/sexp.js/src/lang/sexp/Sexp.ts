import type { SourceLocation } from "../token/index.ts"

export type Sexp = Atom | List

export type Atom = Symbol | String | Int | Float | Keyword

export type Symbol = {
  kind: "Symbol"
  content: string
  meta?: SourceLocation
}

export function Symbol(content: string, meta?: SourceLocation): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta?: SourceLocation
}

export function String(content: string, meta?: SourceLocation): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  meta?: SourceLocation
}

export function Int(content: bigint, meta?: SourceLocation): Int {
  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta?: SourceLocation
}

export function Float(content: number, meta?: SourceLocation): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Keyword = {
  kind: "Keyword"
  content: string
  meta?: SourceLocation
}

export function Keyword(content: string, meta?: SourceLocation): Keyword {
  return {
    kind: "Keyword",
    content,
    meta,
  }
}

export type List = {
  kind: "List"
  elements: Array<Sexp>
  meta?: SourceLocation
}

export function List(elements: Array<Sexp>, meta?: SourceLocation): List {
  return {
    kind: "List",
    elements,
    meta,
  }
}
