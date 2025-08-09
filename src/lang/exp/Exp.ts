import { type Data, type Span } from "@xieyuheng/x-data.js"
import { type Atom } from "../exp/index.ts"

export type Meta = { span: Span }

export type Attributes = Record<string, Exp>

export type Exp =
  | Atom
  | Var
  | Lambda
  | Apply
  | Begin
  | Assign
  | Assert
  | Tael
  | Quote
  | If
  | And
  | Or
  | Cond
  | Match
  | Union
  | Inter
  | Arrow

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
  name: string
  rhs: Exp
  meta: Meta
}

export function Assign(name: string, rhs: Exp, meta: Meta): Assign {
  return {
    kind: "Assign",
    name,
    rhs,
    meta,
  }
}

export type Assert = {
  kind: "Assert"
  exp: Exp
  meta: Meta
}

export function Assert(exp: Exp, meta: Meta): Assert {
  return {
    kind: "Assert",
    exp,
    meta,
  }
}

export type Tael = {
  kind: "Tael"
  elements: Array<Exp>
  attributes: Attributes
  meta: Meta
}

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

export type Quote = {
  kind: "Quote"
  data: Data
  meta: Meta
}

export function Quote(data: Data, meta: Meta): Quote {
  return {
    kind: "Quote",
    data,
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

export type And = {
  kind: "And"
  exps: Array<Exp>
  meta: Meta
}

export function And(exps: Array<Exp>, meta: Meta): And {
  return {
    kind: "And",
    exps,
    meta,
  }
}

export type Or = {
  kind: "Or"
  exps: Array<Exp>
  meta: Meta
}

export function Or(exps: Array<Exp>, meta: Meta): Or {
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

export type Match = {
  kind: "Match"
  matchLines: Array<MatchLine>
  meta: Meta
}

export type MatchLine = {
  pattern: Exp
  body: Exp
}

export function Match(matchLines: Array<MatchLine>, meta: Meta): Match {
  return {
    kind: "Match",
    matchLines,
    meta,
  }
}

export type Union = {
  kind: "Union"
  exps: Array<Exp>
  meta: Meta
}

export function Union(exps: Array<Exp>, meta: Meta): Union {
  return {
    kind: "Union",
    exps,
    meta,
  }
}

export type Inter = {
  kind: "Inter"
  exps: Array<Exp>
  meta: Meta
}

export function Inter(exps: Array<Exp>, meta: Meta): Inter {
  return {
    kind: "Inter",
    exps,
    meta,
  }
}

export type Arrow = {
  kind: "Arrow"
  args: Array<Exp>
  ret: Exp
  meta: Meta
}

export function Arrow(args: Array<Exp>, ret: Exp, meta: Meta): Arrow {
  return {
    kind: "Arrow",
    args,
    ret,
    meta,
  }
}
