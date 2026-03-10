import { type Sexp, type TokenMeta } from "@xieyuheng/sexp.js"

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
  | List
  | Tuple
  | Object
  | Set
  | Hash
  | Quote
  | Arrow
  | Tau
  | Class
  | The
  | Polymorphic
//  | Match

export type Symbol = {
  kind: "Symbol"
  content: string
  meta?: TokenMeta
}

export function Symbol(content: string, meta?: TokenMeta): Symbol {
  return {
    kind: "Symbol",
    content,
    meta,
  }
}

export type String = {
  kind: "String"
  content: string
  meta?: TokenMeta
}

export function String(content: string, meta?: TokenMeta): String {
  return {
    kind: "String",
    content,
    meta,
  }
}

export type Keyword = {
  kind: "Keyword"
  content: string
  meta?: TokenMeta
}

export function Keyword(content: string, meta?: TokenMeta): Keyword {
  return {
    kind: "Keyword",
    content,
    meta,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  meta?: TokenMeta
}

export function Int(content: bigint, meta?: TokenMeta): Int {
  return {
    kind: "Int",
    content,
    meta,
  }
}

export type Float = {
  kind: "Float"
  content: number
  meta?: TokenMeta
}

export function Float(content: number, meta?: TokenMeta): Float {
  return {
    kind: "Float",
    content,
    meta,
  }
}

export type Var = {
  kind: "Var"
  name: string
  meta?: TokenMeta
}

export function Var(name: string, meta?: TokenMeta): Var {
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
  meta?: TokenMeta
}

export function Require(path: string, name: string, meta?: TokenMeta): Require {
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
  meta?: TokenMeta
}

export function Lambda(
  parameters: Array<string>,
  body: Exp,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function Apply(target: Exp, args: Array<Exp>, meta?: TokenMeta): Apply {
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
  meta?: TokenMeta
}

export function Let1(
  name: string,
  rhs: Exp,
  body: Exp,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function Begin1(head: Exp, body: Exp, meta?: TokenMeta): Begin1 {
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
  meta?: TokenMeta
}

export function BeginSugar(sequence: Array<Exp>, meta?: TokenMeta): BeginSugar {
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
  meta?: TokenMeta
}

export function AssignSugar(
  name: string,
  rhs: Exp,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function If(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function When(condition: Exp, consequent: Exp, meta?: TokenMeta): When {
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
  meta?: TokenMeta
}

export function Unless(
  condition: Exp,
  alternative: Exp,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function And(exps: Array<Exp>, meta?: TokenMeta): And {
  return {
    kind: "And",
    exps,
    meta,
  }
}

export type Or = {
  kind: "Or"
  exps: Array<Exp>
  meta?: TokenMeta
}

export function Or(exps: Array<Exp>, meta?: TokenMeta): Or {
  return {
    kind: "Or",
    exps,
    meta,
  }
}

export type Cond = {
  kind: "Cond"
  condClauses: Array<CondClause>
  meta?: TokenMeta
}

export type CondClause = {
  question: Exp
  answer: Exp
}

export function Cond(condClauses: Array<CondClause>, meta?: TokenMeta): Cond {
  return {
    kind: "Cond",
    condClauses,
    meta,
  }
}

export type List = {
  kind: "List"
  elements: Array<Exp>
  meta?: TokenMeta
}

export function List(elements: Array<Exp>, meta?: TokenMeta): List {
  return {
    kind: "List",
    elements,
    meta,
  }
}

export type Tuple = {
  kind: "Tuple"
  elements: Array<Exp>
  meta?: TokenMeta
}

export function Tuple(elements: Array<Exp>, meta?: TokenMeta): Tuple {
  return {
    kind: "Tuple",
    elements,
    meta,
  }
}

export type Object = {
  kind: "Object"
  attributes: Record<string, Exp>
  meta?: TokenMeta
}

export function Object(
  attributes: Record<string, Exp>,
  meta?: TokenMeta,
): Object {
  return {
    kind: "Object",
    attributes,
    meta,
  }
}

export type Set = {
  kind: "Set"
  elements: Array<Exp>
  meta?: TokenMeta
}

export function Set(elements: Array<Exp>, meta?: TokenMeta): Set {
  return {
    kind: "Set",
    elements,
    meta,
  }
}

export type Hash = {
  kind: "Hash"
  entries: Array<{ key: Exp; value: Exp }>
  meta?: TokenMeta
}

export function Hash(
  entries: Array<{ key: Exp; value: Exp }>,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function Quote(sexp: Sexp, meta?: TokenMeta): Quote {
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
  meta?: TokenMeta
}

export function Arrow(
  argTypes: Array<Exp>,
  retType: Exp,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function Tau(elementTypes: Array<Exp>, meta?: TokenMeta): Tau {
  return {
    kind: "Tau",
    elementTypes,
    meta,
  }
}

export type Class = {
  kind: "Class"
  attributeTypes: Record<string, Exp>
  meta?: TokenMeta
}

export function Class(
  attributeTypes: Record<string, Exp>,
  meta?: TokenMeta,
): Class {
  return {
    kind: "Class",
    attributeTypes,
    meta,
  }
}

export type The = {
  kind: "The"
  type: Exp
  exp: Exp
  meta?: TokenMeta
}

export function The(type: Exp, exp: Exp, meta?: TokenMeta): The {
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
  meta?: TokenMeta
}

export function Polymorphic(
  parameters: Array<string>,
  body: Exp,
  meta?: TokenMeta,
): Polymorphic {
  return {
    kind: "Polymorphic",
    parameters,
    body,
    meta,
  }
}

// export type Match = {
//   kind: "Match"
//   targets: Array<Exp>
//   matchClauses: Array<MatchClause>
//   meta?: TokenMeta
// }

// export type MatchClause = {
//   patterns: Array<Exp>
//   body: Exp
//   meta?: TokenMeta
// }

// export function Match(
//   targets: Array<Exp>,
//   matchClauses: Array<MatchClause>,
//   meta?: TokenMeta
// ): Match {
//   return {
//     kind: "Match",
//     targets,
//     matchClauses,
//     meta,
//   }
// }
