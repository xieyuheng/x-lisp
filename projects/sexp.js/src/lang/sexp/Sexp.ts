export type Sexp = Atom | Tael

export type Atom = Symbol | String | Int | Float | Hashtag

export type Attributes = Record<string, Sexp>

export type Symbol = {
  kind: "Symbol"
  content: string
  meta: Attributes
}

export function Symbol(content: string, meta: Attributes = {}): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta: Attributes
}

export function String(content: string, meta: Attributes = {}): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: number
  meta: Attributes
}

export function Int(content: number, meta: Attributes = {}): Int {
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
  meta: Attributes
}

export function Float(content: number, meta: Attributes = {}): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Hashtag = {
  kind: "Hashtag"
  content: string
  meta: Attributes
}

export function Hashtag(content: string, meta: Attributes = {}): Hashtag {
  return {
    kind: "Hashtag",
    content,
    meta,
  }
}

export type Tael = {
  kind: "Tael"
  elements: Array<Sexp>
  attributes: Attributes
  meta: Attributes
}

export function Tael(
  elements: Array<Sexp>,
  attributes: Attributes,
  meta: Attributes = {},
): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
    meta,
  }
}
