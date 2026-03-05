import type { TokenMeta } from "../token/index.ts"

export type Sexp = Atom | List

export type Atom = Symbol | String | Int | Float | Keyword

export type Symbol = {
  kind: "Symbol"
  content: string
  meta?: TokenMeta
}

export function Symbol(content: string, meta?: TokenMeta): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta?: TokenMeta
}

export function String(content: string, meta?: TokenMeta): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  meta?: TokenMeta
}

export function Int(content: bigint, meta?: TokenMeta): Int {
  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta?: TokenMeta
}

export function Float(content: number, meta?: TokenMeta): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Keyword = {
  kind: "Keyword"
  content: string
  meta?: TokenMeta
}

export function Keyword(content: string, meta?: TokenMeta): Keyword {
  return {
    kind: "Keyword",
    content,
    meta,
  }
}

export type List = {
  kind: "List"
  elements: Array<Sexp>
  meta?: TokenMeta
}

export function List(elements: Array<Sexp>, meta?: TokenMeta): List {
  return {
    kind: "List",
    elements,
    meta,
  }
}
