import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"

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
  content: bigint
  meta?: Meta
}

export function Int(content: bigint, meta?: Meta): Int {
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
