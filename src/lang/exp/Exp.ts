import { type Data } from "@xieyuheng/x-data.js"
import { type Binds } from "../exp/index.ts"
import { type Atom } from "../value/index.ts"

export type Exp = Atom | Var | Lambda | Apply | Let | Begin | Tael | Quote
export type Var = { kind: "Var"; name: string }
export type Lambda = { kind: "Lambda"; name: string; ret: Exp }
export type Apply = { kind: "Apply"; target: Exp; arg: Exp }
export type Let = { kind: "Let"; binds: Binds; body: Exp }
export type Begin = { kind: "Begin"; body: Body }

export type Body = Array<Exp>

export type Tael = {
  kind: "Tael"
  elements: Array<Exp>
  attributes: Attributes
}

export type Attributes = Record<string, Exp>

export type Quote = { kind: "Quote"; data: Data }

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export function Lambda(name: string, ret: Exp): Lambda {
  return { kind: "Lambda", name, ret }
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
