import { type TokenMeta as Meta, type Sexp } from "@xieyuheng/sexp.js"

export type Exp =
  | Symbol
  | Hashtag
  | String
  | Int
  | Float
  | Var
  | Lambda
  | Apply
  | Let1
  | Begin1
  | BeginSugar
  | AssignSugar
  | If
  | When
  | Unless
  | And
  | Or
  | Cond
  | Tael
  | Set
  | Hash
  | Quote
  | Arrow
  | The

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

export type Var = {
  kind: "Var"
  name: string
  meta?: Meta
}

export function Var(name: string, meta?: Meta): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type Lambda = {
  kind: "Lambda"
  parameters: Array<string>
  body: Exp
  meta?: Meta
}

export function Lambda(
  parameters: Array<string>,
  body: Exp,
  meta?: Meta,
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
  meta?: Meta
}

export function Apply(target: Exp, args: Array<Exp>, meta?: Meta): Apply {
  return {
    kind: "Apply",
    target,
    args,
    meta,
  }
}

export type Let1 = {
  kind: "Let1"
  name: string
  rhs: Exp
  body: Exp
  meta?: Meta
}

export function Let1(name: string, rhs: Exp, body: Exp, meta?: Meta): Let1 {
  return {
    kind: "Let1",
    name,
    rhs,
    body,
    meta,
  }
}

export type Begin1 = {
  kind: "Begin1"
  head: Exp
  body: Exp
  meta?: Meta
}

export function Begin1(head: Exp, body: Exp, meta?: Meta): Begin1 {
  return {
    kind: "Begin1",
    head,
    body,
    meta,
  }
}

export type BeginSugar = {
  kind: "BeginSugar"
  sequence: Array<Exp>
  meta?: Meta
}

export function BeginSugar(sequence: Array<Exp>, meta?: Meta): BeginSugar {
  return {
    kind: "BeginSugar",
    sequence,
    meta,
  }
}

export type AssignSugar = {
  kind: "AssignSugar"
  name: string
  rhs: Exp
  meta?: Meta
}

export function AssignSugar(name: string, rhs: Exp, meta?: Meta): AssignSugar {
  return {
    kind: "AssignSugar",
    name,
    rhs,
    meta,
  }
}

export type If = {
  kind: "If"
  condition: Exp
  consequent: Exp
  alternative: Exp
  meta?: Meta
}

export function If(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  meta?: Meta,
): If {
  return {
    kind: "If",
    condition,
    consequent,
    alternative,
    meta,
  }
}

export type When = {
  kind: "When"
  condition: Exp
  consequent: Exp
  meta?: Meta
}

export function When(condition: Exp, consequent: Exp, meta?: Meta): When {
  return {
    kind: "When",
    condition,
    consequent,
    meta,
  }
}

export type Unless = {
  kind: "Unless"
  condition: Exp
  alternative: Exp
  meta?: Meta
}

export function Unless(condition: Exp, alternative: Exp, meta?: Meta): Unless {
  return {
    kind: "Unless",
    condition,
    alternative,
    meta,
  }
}

export type And = {
  kind: "And"
  exps: Array<Exp>
  meta?: Meta
}

export function And(exps: Array<Exp>, meta?: Meta): And {
  return {
    kind: "And",
    exps,
    meta,
  }
}

export type Or = {
  kind: "Or"
  exps: Array<Exp>
  meta?: Meta
}

export function Or(exps: Array<Exp>, meta?: Meta): Or {
  return {
    kind: "Or",
    exps,
    meta,
  }
}

export type Cond = {
  kind: "Cond"
  condLines: Array<CondLine>
  meta: Meta
}

export type CondLine = {
  question: Exp
  answer: Exp
}

export function Cond(condLines: Array<CondLine>, meta: Meta): Cond {
  return {
    kind: "Cond",
    condLines,
    meta,
  }
}

export type Tael = {
  kind: "Tael"
  elements: Array<Exp>
  attributes: Record<string, Exp>
  meta?: Meta
}

export function Tael(
  elements: Array<Exp>,
  attributes: Record<string, Exp>,
  meta?: Meta,
): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
    meta,
  }
}

export type Set = {
  kind: "Set"
  elements: Array<Exp>
  meta?: Meta
}

export function Set(elements: Array<Exp>, meta?: Meta): Set {
  return {
    kind: "Set",
    elements,
    meta,
  }
}

export type Hash = {
  kind: "Hash"
  entries: Array<{ key: Exp; value: Exp }>
  meta?: Meta
}

export function Hash(
  entries: Array<{ key: Exp; value: Exp }>,
  meta?: Meta,
): Hash {
  return {
    kind: "Hash",
    entries,
    meta,
  }
}

export type Quote = {
  kind: "Quote"
  sexp: Sexp
  meta?: Meta
}

export function Quote(sexp: Sexp, meta?: Meta): Quote {
  return {
    kind: "Quote",
    sexp,
    meta,
  }
}

export type Arrow = {
  kind: "Arrow"
  argTypes: Array<Exp>
  retType: Exp
  meta?: Meta
}

export function Arrow(argTypes: Array<Exp>, retType: Exp, meta?: Meta): Arrow {
  return {
    kind: "Arrow",
    argTypes,
    retType,
    meta,
  }
}

export type The = {
  kind: "The"
  type: Exp
  exp: Exp
  meta?: Meta
}

export function The(type: Exp, exp: Exp, meta?: Meta): The {
  return {
    kind: "The",
    type,
    exp,
    meta,
  }
}
