import { type Data, type TokenMeta } from "@xieyuheng/x-data.js"
import { type Atom } from "../exp/index.ts"

export type Meta = TokenMeta

export type Attributes = Record<string, Exp>

export type Exp =
  | Atom
  | Var
  | Lambda
  | Thunk
  | Lazy
  | LambdaLazy
  | Apply
  | Begin
  | Assign
  | Assert
  | AssertNot
  | AssertEqual
  | AssertNotEqual
  | Void
  | Null
  | Tael
  | Quote
  | Quasiquote
  | If
  | And
  | Or
  | Cond
  | Match
  | Union
  | Inter
  | Arrow
  | RecordGet
  | Compose
  | Pipe

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

export type Thunk = {
  kind: "Thunk"
  body: Exp
  meta: Meta
}

export function Thunk(body: Exp, meta: Meta): Thunk {
  return {
    kind: "Thunk",
    body,
    meta,
  }
}

export type Lazy = {
  kind: "Lazy"
  exp: Exp
  meta: Meta
}

export function Lazy(exp: Exp, meta: Meta): Lazy {
  return {
    kind: "Lazy",
    exp,
    meta,
  }
}

export type LambdaLazy = {
  kind: "LambdaLazy"
  parameters: Array<string>
  body: Exp
  meta: Meta
}

export function LambdaLazy(
  parameters: Array<string>,
  body: Exp,
  meta: Meta,
): LambdaLazy {
  return {
    kind: "LambdaLazy",
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

export type AssertNot = {
  kind: "AssertNot"
  exp: Exp
  meta: Meta
}

export function AssertNot(exp: Exp, meta: Meta): AssertNot {
  return {
    kind: "AssertNot",
    exp,
    meta,
  }
}

export type AssertEqual = {
  kind: "AssertEqual"
  lhs: Exp
  rhs: Exp
  meta: Meta
}

export function AssertEqual(lhs: Exp, rhs: Exp, meta: Meta): AssertEqual {
  return {
    kind: "AssertEqual",
    lhs,
    rhs,
    meta,
  }
}

export type AssertNotEqual = {
  kind: "AssertNotEqual"
  lhs: Exp
  rhs: Exp
  meta: Meta
}

export function AssertNotEqual(lhs: Exp, rhs: Exp, meta: Meta): AssertNotEqual {
  return {
    kind: "AssertNotEqual",
    lhs,
    rhs,
    meta,
  }
}

export type Void = {
  kind: "Void"
  meta: Meta
}

export function Void(meta: Meta): Void {
  return {
    kind: "Void",
    meta,
  }
}

export type Null = {
  kind: "Null"
  meta: Meta
}

export function Null(meta: Meta): Null {
  return {
    kind: "Null",
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
  sexp: Data
  meta: Meta
}

export function Quote(sexp: Data, meta: Meta): Quote {
  return {
    kind: "Quote",
    sexp,
    meta,
  }
}

export type Quasiquote = {
  kind: "Quasiquote"
  sexp: Data
  meta: Meta
}

export function Quasiquote(sexp: Data, meta: Meta): Quasiquote {
  return {
    kind: "Quasiquote",
    sexp,
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
  target: Exp
  matchLines: Array<MatchLine>
  meta: Meta
}

export type MatchLine = {
  pattern: Exp
  body: Exp
}

export function Match(
  target: Exp,
  matchLines: Array<MatchLine>,
  meta: Meta,
): Match {
  return {
    kind: "Match",
    target,
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

export type RecordGet = {
  kind: "RecordGet"
  name: string
  target: Exp
  meta: Meta
}

export function RecordGet(name: string, target: Exp, meta: Meta): RecordGet {
  return {
    kind: "RecordGet",
    name,
    target,
    meta,
  }
}

export type Compose = {
  kind: "Compose"
  exps: Array<Exp>
  meta: Meta
}

export function Compose(exps: Array<Exp>, meta: Meta): Compose {
  return {
    kind: "Compose",
    exps,
    meta,
  }
}

export type Pipe = {
  kind: "Pipe"
  arg: Exp
  exps: Array<Exp>
  meta: Meta
}

export function Pipe(arg: Exp, exps: Array<Exp>, meta: Meta): Pipe {
  return {
    kind: "Pipe",
    arg,
    exps,
    meta,
  }
}
