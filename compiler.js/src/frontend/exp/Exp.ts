import { type TokenMeta } from "@xieyuheng/x-sexp.js"

export type Meta = TokenMeta

export type Exp =
  | Var
  | Symbol
  | Hashtag
  | String
  | Int
  | Float
  | Lambda
  | Apply
  | Begin
  | Assign
  | If

export type Var = {
  kind: "Var"
  name: string
  meta: Meta
}

export function Var(name: string, meta: Meta): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type Symbol = {
  kind: "Symbol"
  content: string
  meta: Meta
}

export function Symbol(content: string, meta: Meta): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta: Meta
}

export function String(content: string, meta: Meta): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Hashtag = {
  kind: "Hashtag"
  content: string
  meta: Meta
}

export function Hashtag(content: string, meta: Meta): Hashtag {
  return {
    kind: "Hashtag",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: number
  meta: Meta
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

export type Float = {
  kind: "Float"
  content: number
  meta: Meta
}

export function Float(content: number, meta: Meta): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Lambda = {
  kind: "Lambda"
  parameters: Array<string>
  body: Exp
  meta: Meta
}

export function Lambda(
  parameters: Array<string>,
  body: Exp,
  meta: Meta,
): Lambda {
  return {
    kind: "Lambda",
    parameters,
    body,
    meta,
  }
}

export type Apply = {
  kind: "Apply"
  target: Exp
  args: Array<Exp>
  meta: Meta
}

export function Apply(target: Exp, args: Array<Exp>, meta: Meta): Apply {
  return {
    kind: "Apply",
    target,
    args,
    meta,
  }
}

export type Begin = {
  kind: "Begin"
  sequence: Array<Exp>
  meta: Meta
}

export function Begin(sequence: Array<Exp>, meta: Meta): Begin {
  return {
    kind: "Begin",
    sequence,
    meta,
  }
}

export type Assign = {
  kind: "Assign"
  lhs: Exp
  rhs: Exp
  meta: Meta
}

export function Assign(lhs: Exp, rhs: Exp, meta: Meta): Assign {
  return {
    kind: "Assign",
    lhs,
    rhs,
    meta,
  }
}

export type If = {
  kind: "If"
  condition: Exp
  consequent: Exp
  alternative: Exp
  meta: Meta
}

export function If(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  meta: Meta,
): If {
  return {
    kind: "If",
    condition,
    consequent,
    alternative,
    meta,
  }
}
