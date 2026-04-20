export type Exp = Symbol | Keyword | String | Int | Float

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

export type Keyword = {
  kind: "Keyword"
  content: string
}

export function Keyword(content: string): Keyword {
  return {
    kind: "Keyword",
    content,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
}

export function Int(content: bigint): Int {
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
