import { type Data } from "@xieyuheng/x-data.js"
import { type Binds } from "../exp/index.ts"

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
export type Bool = { kind: "Bool"; content: boolean }
export type Symbol = { kind: "Symbol"; content: string }
export type String = { kind: "String"; content: string }
export type Int = { kind: "Int"; content: number }
export type Float = { kind: "Float"; content: number }

export type Var = { kind: "Var"; name: string }
export type Lambda = { kind: "Lambda"; name: string; body: Exp }
export type Apply = { kind: "Apply"; target: Exp; arg: Exp }
export type Let = { kind: "Let"; binds: Binds; body: Exp }
export type Begin = { kind: "Begin"; body: Body }
export type Assign = { kind: "Assign"; name: string; rhs: Exp }
// export type Assert = { kind: "Assert"; exp: Exp }

export type Tael = {
  kind: "Tael"
  elements: Array<Exp>
  attributes: Attributes
}

export type Quote = { kind: "Quote"; data: Data }

export function Bool(content: boolean): Bool {
  return {
    kind: "Bool",
    content,
  }
}

export function Symbol(content: string): Symbol {
  return {
    kind: "Symbol",
    content,
  }
}

export function String(content: string): String {
  return {
    kind: "String",
    content,
  }
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

export function Float(content: number): Float {
  return {
    kind: "Float",
    content,
  }
}

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export function Lambda(name: string, body: Exp): Lambda {
  return { kind: "Lambda", name, body }
}

export function Apply(target: Exp, arg: Exp): Apply {
  return { kind: "Apply", target, arg }
}

export function Let(binds: Binds, body: Exp): Let {
  return { kind: "Let", binds, body }
}

export function Begin(body: Body): Begin {
  return { kind: "Begin", body }
}

export function Assign(name: string, rhs: Exp): Assign {
  return { kind: "Assign", name, rhs }
}

// export function Assert(exp: Exp): Assert {
//   return { kind: "Assert", exp }
// }

export function Tael(elements: Array<Exp>, attributes: Attributes): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
  }
}

export function Quote(data: Data): Quote {
  return { kind: "Quote", data }
}
