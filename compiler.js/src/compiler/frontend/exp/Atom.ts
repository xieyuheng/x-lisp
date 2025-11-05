import { type TokenMeta } from "@xieyuheng/x-sexp.js"

type Meta = TokenMeta

export type Atom = Symbol | Hashtag | String | Int | Float

export type Symbol = {
  kind: "Symbol"
  content: string
  meta?: Meta
}

export function Symbol(content: string, meta?: Meta): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta?: Meta
}

export function String(content: string, meta?: Meta): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Hashtag = {
  kind: "Hashtag"
  content: string
  meta?: Meta
}

export function Hashtag(content: string, meta?: Meta): Hashtag {
  return {
    kind: "Hashtag",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: number
  meta?: Meta
}

export function Int(content: number, meta?: Meta): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta?: Meta
}

export function Float(content: number, meta?: Meta): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}
