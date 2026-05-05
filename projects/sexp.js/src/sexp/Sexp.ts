import * as S from "../index.ts"
import type { SourceLocation } from "../token/index.ts"

export type Sexp = Atom | List

export type Atom = Symbol | String | Int | Float | Keyword

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

export function isSymbol(sexp: Sexp): sexp is Symbol {
  return sexp.kind === "Symbol"
}

export function asSymbol(sexp: Sexp): Symbol {
  if (isSymbol(sexp)) return sexp
  throw new Error(`[asSymbol] fail on: ${S.formatSexp(sexp)}`)
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

export function isString(sexp: Sexp): sexp is String {
  return sexp.kind === "String"
}

export function asString(sexp: Sexp): String {
  if (isString(sexp)) return sexp
  throw new Error(`[asString] fail on: ${S.formatSexp(sexp)}`)
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

export function isInt(sexp: Sexp): sexp is Int {
  return sexp.kind === "Int"
}

export function asInt(sexp: Sexp): Int {
  if (isInt(sexp)) return sexp
  throw new Error(`[asInt] fail on: ${S.formatSexp(sexp)}`)
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

export function isFloat(sexp: Sexp): sexp is Float {
  return sexp.kind === "Float"
}

export function asFloat(sexp: Sexp): Float {
  if (isFloat(sexp)) return sexp
  throw new Error(`[asFloat] fail on: ${S.formatSexp(sexp)}`)
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

export function isKeyword(sexp: Sexp): sexp is Keyword {
  return sexp.kind === "Keyword"
}

export function asKeyword(sexp: Sexp): Keyword {
  if (isKeyword(sexp)) return sexp
  throw new Error(`[asKeyword] fail on: ${S.formatSexp(sexp)}`)
}

export type List = {
  kind: "List"
  elements: Array<Sexp>
  location?: SourceLocation
}

export function List(elements: Array<Sexp>, location?: SourceLocation): List {
  return {
    kind: "List",
    elements,
    location,
  }
}

export function isList(sexp: Sexp): sexp is List {
  return sexp.kind === "List"
}

export function asList(sexp: Sexp): List {
  if (isList(sexp)) return sexp
  throw new Error(`[asList] fail on: ${S.formatSexp(sexp)}`)
}

export function Cons(head: Sexp, tail: Sexp): List {
  if (!isList(tail)) {
    throw new Error(`[Cons] tail to be a list, tail kind: ${tail.kind}.`)
  }

  return List([head, ...tail.elements], tail.location)
}
