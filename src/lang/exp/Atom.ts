import { type Span } from "@xieyuheng/x-data.js"

type Meta = { span: Span }

export type Atom = Bool | Symbol | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean; meta: Meta }
export type Symbol = { kind: "Symbol"; content: string; meta: Meta }
export type String = { kind: "String"; content: string; meta: Meta }
export type Int = { kind: "Int"; content: number; meta: Meta }
export type Float = { kind: "Float"; content: number; meta: Meta }

export function Bool(content: boolean, meta: Meta): Bool {
  return {
    kind: "Bool",
    content,
    meta,
  }
}

export function Symbol(content: string, meta: Meta): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export function String(content: string, meta: Meta): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export function Int(content: number, meta: Meta): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
    meta,
  }
}

export function Float(content: number, meta: Meta): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}
