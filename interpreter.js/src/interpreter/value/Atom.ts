export type Atom = Symbol | Hashtag | String | Int | Float

export type Symbol = {
  kind: "Symbol"
  content: string
}

export function Symbol(content: string): Symbol {
  return {
    kind: "Symbol",
    content,
  }
}

export type String = {
  kind: "String"
  content: string
}

export function String(content: string): String {
  return {
    kind: "String",
    content,
  }
}

export type Hashtag = {
  kind: "Hashtag"
  content: string
}

export function Hashtag(content: string): Hashtag {
  return {
    kind: "Hashtag",
    content,
  }
}

export type Int = {
  kind: "Int"
  content: number
}

export function Int(content: number): Int {
  if (!Number.isInteger(content)) {
    throw new Error(`[intAtom] expect number be int: ${content}.`)
  }

  return {
    kind: "Int",
    content,
  }
}

export type Float = {
  kind: "Float"
  content: number
}

export function Float(content: number): Float {
  return {
    kind: "Float",
    content,
  }
}
