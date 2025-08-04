import { type Data, type Span } from "@xieyuheng/x-data.js"
import { type Binds } from "../exp/index.ts"

type Meta = { span: Span }

export type Body = Array<Exp>
export type Attributes = Record<string, Exp>

export type Exp =
  | Atom
  | Var
  | Lambda
  | Apply
  | Let
  | Begin
  | Assign
  // | Assert
  | Tael
  | Quote

export type Atom = Bool | Symbol | String | Int | Float
export type Bool = { kind: "Bool"; content: boolean; meta: Meta }
export type Symbol = { kind: "Symbol"; content: string; meta: Meta }
export type String = { kind: "String"; content: string; meta: Meta }
export type Int = { kind: "Int"; content: number; meta: Meta }
export type Float = { kind: "Float"; content: number; meta: Meta }

export type Var = { kind: "Var"; name: string; meta: Meta }
export type Lambda = { kind: "Lambda"; name: string; body: Exp; meta: Meta }
export type Apply = { kind: "Apply"; target: Exp; arg: Exp; meta: Meta }
export type Let = { kind: "Let"; binds: Binds; body: Exp; meta: Meta }
export type Begin = { kind: "Begin"; body: Body; meta: Meta }
export type Assign = { kind: "Assign"; name: string; rhs: Exp; meta: Meta }
// export type Assert = { kind: "Assert"; exp: Exp , meta: Meta}

export type Tael = {
  kind: "Tael"
  elements: Array<Exp>
  attributes: Attributes
  meta: Meta
}

export type Quote = { kind: "Quote"; data: Data; meta: Meta }

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

export function Var(name: string, meta: Meta): Var {
  return { kind: "Var", name, meta }
}

export function Lambda(name: string, body: Exp, meta: Meta): Lambda {
  return { kind: "Lambda", name, body, meta }
}

export function Apply(target: Exp, arg: Exp, meta: Meta): Apply {
  return { kind: "Apply", target, arg, meta }
}

export function Let(binds: Binds, body: Exp, meta: Meta): Let {
  return { kind: "Let", binds, body, meta }
}

export function Begin(body: Body, meta: Meta): Begin {
  return { kind: "Begin", body, meta }
}

export function Assign(name: string, rhs: Exp, meta: Meta): Assign {
  return { kind: "Assign", name, rhs, meta }
}

// export function Assert(exp: Exp, meta: Meta): Assert {
//   return { kind: "Assert", exp, meta }
// }

export function Tael(
  elements: Array<Exp>,
  attributes: Attributes,
  meta: Meta,
): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
    meta,
  }
}

export function Quote(data: Data, meta: Meta): Quote {
  return { kind: "Quote", data, meta }
}
