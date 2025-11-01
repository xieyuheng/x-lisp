import { type Sexp, type TokenMeta } from "@xieyuheng/x-sexp.js"

export type Meta = TokenMeta

export type Attributes = Record<string, Exp>

export type Exp =
  | Var
  | Symbol
  | Hashtag
  | String
  | Int
  | Float
  | Lambda
  | VariadicLambda
  | NullaryLambda
  | Apply
  | BeginSugar
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
  | Comment
  | Quasiquote
  | If
  | When
  | Unless
  | And
  | Or
  | Cond
  | Match
  | Arrow
  | VariadicArrow
  | Tau
  | The
  | Pattern
  | Polymorphic
  | Specific
  | Comment

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

export type VariadicLambda = {
  kind: "VariadicLambda"
  variadicParameter: string
  body: Exp
  meta: Meta
}

export function VariadicLambda(
  variadicParameter: string,
  body: Exp,
  meta: Meta,
): VariadicLambda {
  return {
    kind: "VariadicLambda",
    variadicParameter,
    body,
    meta,
  }
}

export type NullaryLambda = {
  kind: "NullaryLambda"
  body: Exp
  meta: Meta
}

export function NullaryLambda(body: Exp, meta: Meta): NullaryLambda {
  return {
    kind: "NullaryLambda",
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

export type BeginSugar = {
  kind: "BeginSugar"
  sequence: Array<Exp>
  meta: Meta
}

export function BeginSugar(sequence: Array<Exp>, meta: Meta): BeginSugar {
  return {
    kind: "BeginSugar",
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
  sexp: Sexp
  meta: Meta
}

export function Quote(sexp: Sexp, meta: Meta): Quote {
  return {
    kind: "Quote",
    sexp,
    meta,
  }
}

export type Comment = {
  kind: "Comment"
  sexps: Array<Sexp>
  meta: Meta
}

export function Comment(sexps: Array<Sexp>, meta: Meta): Comment {
  return {
    kind: "Comment",
    sexps,
    meta,
  }
}

export type Quasiquote = {
  kind: "Quasiquote"
  sexp: Sexp
  meta: Meta
}

export function Quasiquote(sexp: Sexp, meta: Meta): Quasiquote {
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

export type Arrow = {
  kind: "Arrow"
  argSchemas: Array<Exp>
  retSchema: Exp
  meta: Meta
}

export function Arrow(
  argSchemas: Array<Exp>,
  retSchema: Exp,
  meta: Meta,
): Arrow {
  return {
    kind: "Arrow",
    argSchemas,
    retSchema,
    meta,
  }
}

export type VariadicArrow = {
  kind: "VariadicArrow"
  argSchema: Exp
  retSchema: Exp
  meta: Meta
}

export function VariadicArrow(
  argSchema: Exp,
  retSchema: Exp,
  meta: Meta,
): VariadicArrow {
  return {
    kind: "VariadicArrow",
    argSchema,
    retSchema,
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
