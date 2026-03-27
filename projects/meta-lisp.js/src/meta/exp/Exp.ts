import { type Sexp, type SourceLocation } from "@xieyuheng/sexp.js"

export type Exp =
  | Symbol
  | Keyword
  | String
  | Int
  | Float
  | Var
  | Require
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
  | LiteralList
  | LiteralTuple
  | LiteralRecord
  | LiteralSet
  | LiteralHash
  | Quote
  | Arrow
  | Tau
  | Interface
  | ExtendInterface
  | Extend
  | Update
  | UpdateMut
  | The
  | Polymorphic
  | Match

export type Symbol = {
  kind: "Symbol"
  content: string
  meta?: SourceLocation
}

export function Symbol(content: string, meta?: SourceLocation): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta?: SourceLocation
}

export function String(content: string, meta?: SourceLocation): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Keyword = {
  kind: "Keyword"
  content: string
  meta?: SourceLocation
}

export function Keyword(content: string, meta?: SourceLocation): Keyword {
  return {
    kind: "Keyword",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  meta?: SourceLocation
}

export function Int(content: bigint, meta?: SourceLocation): Int {
  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta?: SourceLocation
}

export function Float(content: number, meta?: SourceLocation): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Var = {
  kind: "Var"
  name: string
  meta?: SourceLocation
}

export function Var(name: string, meta?: SourceLocation): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type Require = {
  kind: "Require"
  path: string
  name: string
  meta?: SourceLocation
}

export function Require(
  path: string,
  name: string,
  meta?: SourceLocation,
): Require {
  return {
    kind: "Require",
    path,
    name,
    meta,
  }
}

export type Lambda = {
  kind: "Lambda"
  parameters: Array<string>
  body: Exp
  meta?: SourceLocation
}

export function Lambda(
  parameters: Array<string>,
  body: Exp,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function Apply(
  target: Exp,
  args: Array<Exp>,
  meta?: SourceLocation,
): Apply {
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
  meta?: SourceLocation
}

export function Let1(
  name: string,
  rhs: Exp,
  body: Exp,
  meta?: SourceLocation,
): Let1 {
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
  meta?: SourceLocation
}

export function Begin1(head: Exp, body: Exp, meta?: SourceLocation): Begin1 {
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
  meta?: SourceLocation
}

export function BeginSugar(
  sequence: Array<Exp>,
  meta?: SourceLocation,
): BeginSugar {
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
  meta?: SourceLocation
}

export function AssignSugar(
  name: string,
  rhs: Exp,
  meta?: SourceLocation,
): AssignSugar {
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
  meta?: SourceLocation
}

export function If(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function When(
  condition: Exp,
  consequent: Exp,
  meta?: SourceLocation,
): When {
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
  meta?: SourceLocation
}

export function Unless(
  condition: Exp,
  alternative: Exp,
  meta?: SourceLocation,
): Unless {
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
  meta?: SourceLocation
}

export function And(exps: Array<Exp>, meta?: SourceLocation): And {
  return {
    kind: "And",
    exps,
    meta,
  }
}

export type Or = {
  kind: "Or"
  exps: Array<Exp>
  meta?: SourceLocation
}

export function Or(exps: Array<Exp>, meta?: SourceLocation): Or {
  return {
    kind: "Or",
    exps,
    meta,
  }
}

export type Cond = {
  kind: "Cond"
  clauses: Array<CondClause>
  meta?: SourceLocation
}

export type CondClause = {
  question: Exp
  answer: Exp
  meta?: SourceLocation
}

export function CondClause(
  question: Exp,
  answer: Exp,
  meta?: SourceLocation,
): CondClause {
  return {
    question,
    answer,
    meta,
  }
}

export function Cond(clauses: Array<CondClause>, meta?: SourceLocation): Cond {
  return {
    kind: "Cond",
    clauses,
    meta,
  }
}

export type LiteralList = {
  kind: "LiteralList"
  elements: Array<Exp>
  meta?: SourceLocation
}

export function LiteralList(
  elements: Array<Exp>,
  meta?: SourceLocation,
): LiteralList {
  return {
    kind: "LiteralList",
    elements,
    meta,
  }
}

export type LiteralTuple = {
  kind: "LiteralTuple"
  elements: Array<Exp>
  meta?: SourceLocation
}

export function LiteralTuple(
  elements: Array<Exp>,
  meta?: SourceLocation,
): LiteralTuple {
  return {
    kind: "LiteralTuple",
    elements,
    meta,
  }
}

export type LiteralRecord = {
  kind: "LiteralRecord"
  attributes: Record<string, Exp>
  meta?: SourceLocation
}

export function LiteralRecord(
  attributes: Record<string, Exp>,
  meta?: SourceLocation,
): LiteralRecord {
  return {
    kind: "LiteralRecord",
    attributes,
    meta,
  }
}

export type LiteralSet = {
  kind: "LiteralSet"
  elements: Array<Exp>
  meta?: SourceLocation
}

export function LiteralSet(
  elements: Array<Exp>,
  meta?: SourceLocation,
): LiteralSet {
  return {
    kind: "LiteralSet",
    elements,
    meta,
  }
}

export type LiteralHash = {
  kind: "LiteralHash"
  entries: Array<{ key: Exp; value: Exp }>
  meta?: SourceLocation
}

export function LiteralHash(
  entries: Array<{ key: Exp; value: Exp }>,
  meta?: SourceLocation,
): LiteralHash {
  return {
    kind: "LiteralHash",
    entries,
    meta,
  }
}

export type Quote = {
  kind: "Quote"
  sexp: Sexp
  meta?: SourceLocation
}

export function Quote(sexp: Sexp, meta?: SourceLocation): Quote {
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
  meta?: SourceLocation
}

export function Arrow(
  argTypes: Array<Exp>,
  retType: Exp,
  meta?: SourceLocation,
): Arrow {
  return {
    kind: "Arrow",
    argTypes,
    retType,
    meta,
  }
}

export type Tau = {
  kind: "Tau"
  elementTypes: Array<Exp>
  meta?: SourceLocation
}

export function Tau(elementTypes: Array<Exp>, meta?: SourceLocation): Tau {
  return {
    kind: "Tau",
    elementTypes,
    meta,
  }
}

export type Interface = {
  kind: "Interface"
  attributeTypes: Record<string, Exp>
  meta?: SourceLocation
}

export function Interface(
  attributeTypes: Record<string, Exp>,
  meta?: SourceLocation,
): Interface {
  return {
    kind: "Interface",
    attributeTypes,
    meta,
  }
}

export type ExtendInterface = {
  kind: "ExtendInterface"
  baseType: Exp
  attributeTypes: Record<string, Exp>
  meta?: SourceLocation
}

export function ExtendInterface(
  baseType: Exp,
  attributeTypes: Record<string, Exp>,
  meta?: SourceLocation,
): ExtendInterface {
  return {
    kind: "ExtendInterface",
    baseType,
    attributeTypes,
    meta,
  }
}

export type Extend = {
  kind: "Extend"
  base: Exp
  attributes: Record<string, Exp>
  meta?: SourceLocation
}

export function Extend(
  base: Exp,
  attributes: Record<string, Exp>,
  meta?: SourceLocation,
): Extend {
  return {
    kind: "Extend",
    base,
    attributes,
    meta,
  }
}

export type Update = {
  kind: "Update"
  base: Exp
  attributes: Record<string, Exp>
  meta?: SourceLocation
}

export function Update(
  base: Exp,
  attributes: Record<string, Exp>,
  meta?: SourceLocation,
): Update {
  return {
    kind: "Update",
    base,
    attributes,
    meta,
  }
}

export type UpdateMut = {
  kind: "UpdateMut"
  base: Exp
  attributes: Record<string, Exp>
  meta?: SourceLocation
}

export function UpdateMut(
  base: Exp,
  attributes: Record<string, Exp>,
  meta?: SourceLocation,
): UpdateMut {
  return {
    kind: "UpdateMut",
    base,
    attributes,
    meta,
  }
}

export type The = {
  kind: "The"
  type: Exp
  exp: Exp
  meta?: SourceLocation
}

export function The(type: Exp, exp: Exp, meta?: SourceLocation): The {
  return {
    kind: "The",
    type,
    exp,
    meta,
  }
}

export type Polymorphic = {
  kind: "Polymorphic"
  parameters: Array<string>
  body: Exp
  meta?: SourceLocation
}

export function Polymorphic(
  parameters: Array<string>,
  body: Exp,
  meta?: SourceLocation,
): Polymorphic {
  return {
    kind: "Polymorphic",
    parameters,
    body,
    meta,
  }
}

export type Match = {
  kind: "Match"
  targets: Array<Exp>
  clauses: Array<MatchClause>
  meta?: SourceLocation
}

export type MatchClause = {
  patterns: Array<Exp>
  body: Exp
  meta?: SourceLocation
}

export function MatchClause(
  patterns: Array<Exp>,
  body: Exp,
  meta?: SourceLocation,
): MatchClause {
  return {
    patterns,
    body,
    meta,
  }
}

export function Match(
  targets: Array<Exp>,
  clauses: Array<MatchClause>,
  meta?: SourceLocation,
): Match {
  return {
    kind: "Match",
    targets,
    clauses,
    meta,
  }
}
