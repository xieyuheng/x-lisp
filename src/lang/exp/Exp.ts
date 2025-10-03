import { type Data, type TokenMeta } from "@xieyuheng/x-data.js"
import { type Atom } from "../exp/index.ts"

export type Meta = TokenMeta

export type Attributes = Record<string, Exp>

export type Exp =
  | Atom
  | Var
  | Lambda
  | Thunk
  | Apply
  | Begin
  | Assign
  | Assert
  | AssertNot
  | AssertEqual
  | AssertNotEqual
  | AssertThe
  | Tael
  | Set
  | Hash
  | Quote
  | Quasiquote
  | If
  | When
  | Unless
  | And
  | Or
  | Cond
  | Match
  | Union
  | Inter
  | Arrow
  | Compose
  | Pipe
  | Tau
  | The
  | Pattern
  | Polymorphic
  | Specific

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
  parameters: Array<Exp>
  body: Exp
  meta: Meta
}

export function Lambda(parameters: Array<Exp>, body: Exp, meta: Meta): Lambda {
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

export type AssertThe = {
  kind: "AssertThe"
  schema: Exp
  exp: Exp
  meta: Meta
}

export function AssertThe(schema: Exp, exp: Exp, meta: Meta): AssertThe {
  return {
    kind: "AssertThe",
    schema,
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

export type Set = {
  kind: "Set"
  elements: Array<Exp>
  meta: Meta
}

export function Set(elements: Array<Exp>, meta: Meta): Set {
  return {
    kind: "Set",
    elements,
    meta,
  }
}

export type Hash = {
  kind: "Hash"
  entries: Array<{ key: Exp; value: Exp }>
  meta: Meta
}

export function Hash(
  entries: Array<{ key: Exp; value: Exp }>,
  meta: Meta,
): Hash {
  return {
    kind: "Hash",
    entries,
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

export type When = {
  kind: "When"
  condition: Exp
  consequent: Exp
  meta: Meta
}

export function When(condition: Exp, consequent: Exp, meta: Meta): When {
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
  consequent: Exp
  meta: Meta
}

export function Unless(condition: Exp, consequent: Exp, meta: Meta): Unless {
  return {
    kind: "Unless",
    condition,
    consequent,
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

export type Tau = {
  kind: "Tau"
  elementSchemas: Array<Exp>
  attributeSchemas: Attributes
  meta: Meta
}

export function Tau(
  elementSchemas: Array<Exp>,
  attributeSchemas: Attributes,
  meta: Meta,
): Tau {
  return {
    kind: "Tau",
    elementSchemas,
    attributeSchemas,
    meta,
  }
}

export type The = {
  kind: "The"
  schema: Exp
  exp: Exp
  meta: Meta
}

export function The(schema: Exp, exp: Exp, meta: Meta): The {
  return {
    kind: "The",
    schema,
    exp,
    meta,
  }
}

export type Pattern = {
  kind: "Pattern"
  pattern: Exp
  meta: Meta
}

export function Pattern(pattern: Exp, meta: Meta): Pattern {
  return {
    kind: "Pattern",
    pattern,
    meta,
  }
}

export type Polymorphic = {
  kind: "Polymorphic"
  parameters: Array<string>
  schema: Exp
  meta: Meta
}

export function Polymorphic(
  parameters: Array<string>,
  schema: Exp,
  meta: Meta,
): Polymorphic {
  return {
    kind: "Polymorphic",
    parameters,
    schema,
    meta,
  }
}

export type Specific = {
  kind: "Specific"
  target: Exp
  args: Array<Exp>
  meta: Meta
}

export function Specific(target: Exp, args: Array<Exp>, meta: Meta): Specific {
  return {
    kind: "Specific",
    target,
    args,
    meta,
  }
}
