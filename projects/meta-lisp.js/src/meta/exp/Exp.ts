import { type Sexp, type SourceLocation } from "@xieyuheng/sexp.js"

export type Exp =
  | Symbol
  | Keyword
  | String
  | Int
  | Float
  | Var
  | QualifiedVar
  | Lambda
  | Apply
  | Let1
  | Let
  | LetStar
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
  | LiteralRecord
  | LiteralSet
  | LiteralHash
  | Quote
  | Arrow
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
  location?: SourceLocation
}

export function Symbol(content: string, location?: SourceLocation): Symbol {
  return {
    kind: "Symbol",
    content,
    location,
  }
}

export type String = {
  kind: "String"
  content: string
  location?: SourceLocation
}

export function String(content: string, location?: SourceLocation): String {
  return {
    kind: "String",
    content,
    location,
  }
}

export type Keyword = {
  kind: "Keyword"
  content: string
  location?: SourceLocation
}

export function Keyword(content: string, location?: SourceLocation): Keyword {
  return {
    kind: "Keyword",
    content,
    location,
  }
}

export type Int = {
  kind: "Int"
  content: bigint
  location?: SourceLocation
}

export function Int(content: bigint, location?: SourceLocation): Int {
  return {
    kind: "Int",
    content,
    location,
  }
}

export type Float = {
  kind: "Float"
  content: number
  location?: SourceLocation
}

export function Float(content: number, location?: SourceLocation): Float {
  return {
    kind: "Float",
    content,
    location,
  }
}

export type Var = {
  kind: "Var"
  name: string
  location?: SourceLocation
}

export function Var(name: string, location?: SourceLocation): Var {
  return {
    kind: "Var",
    name,
    location,
  }
}

export type QualifiedVar = {
  kind: "QualifiedVar"
  modName: string
  name: string
  location?: SourceLocation
}

export function QualifiedVar(
  modName: string,
  name: string,
  location?: SourceLocation,
): QualifiedVar {
  return {
    kind: "QualifiedVar",
    modName,
    name,
    location,
  }
}

export type Lambda = {
  kind: "Lambda"
  parameters: Array<string>
  body: Exp
  location?: SourceLocation
}

export function Lambda(
  parameters: Array<string>,
  body: Exp,
  location?: SourceLocation,
): Lambda {
  return {
    kind: "Lambda",
    parameters,
    body,
    location,
  }
}

export type Apply = {
  kind: "Apply"
  target: Exp
  args: Array<Exp>
  location?: SourceLocation
}

export function Apply(
  target: Exp,
  args: Array<Exp>,
  location?: SourceLocation,
): Apply {
  return {
    kind: "Apply",
    target,
    args,
    location,
  }
}

export type Let1 = {
  kind: "Let1"
  name: string
  rhs: Exp
  body: Exp
  location?: SourceLocation
}

export function Let1(
  name: string,
  rhs: Exp,
  body: Exp,
  location?: SourceLocation,
): Let1 {
  return {
    kind: "Let1",
    name,
    rhs,
    body,
    location,
  }
}

export type Binding = {
  name: string
  rhs: Exp
  location?: SourceLocation
}

export function Binding(
  name: string,
  rhs: Exp,
  location?: SourceLocation,
): Binding {
  return {
    name,
    rhs,
    location,
  }
}

export type Let = {
  kind: "Let"
  bindings: Array<Binding>
  body: Exp
  location?: SourceLocation
}

export function Let(
  bindings: Array<Binding>,
  body: Exp,
  location?: SourceLocation,
): Let {
  return {
    kind: "Let",
    bindings,
    body,
    location,
  }
}

export type LetStar = {
  kind: "LetStar"
  bindings: Array<Binding>
  body: Exp
  location?: SourceLocation
}

export function LetStar(
  bindings: Array<Binding>,
  body: Exp,
  location?: SourceLocation,
): LetStar {
  return {
    kind: "LetStar",
    bindings,
    body,
    location,
  }
}

export type Begin1 = {
  kind: "Begin1"
  head: Exp
  body: Exp
  location?: SourceLocation
}

export function Begin1(
  head: Exp,
  body: Exp,
  location?: SourceLocation,
): Begin1 {
  return {
    kind: "Begin1",
    head,
    body,
    location,
  }
}

export type BeginSugar = {
  kind: "BeginSugar"
  sequence: Array<Exp>
  location?: SourceLocation
}

export function BeginSugar(
  sequence: Array<Exp>,
  location?: SourceLocation,
): BeginSugar {
  return {
    kind: "BeginSugar",
    sequence,
    location,
  }
}

export type AssignSugar = {
  kind: "AssignSugar"
  name: string
  rhs: Exp
  location?: SourceLocation
}

export function AssignSugar(
  name: string,
  rhs: Exp,
  location?: SourceLocation,
): AssignSugar {
  return {
    kind: "AssignSugar",
    name,
    rhs,
    location,
  }
}

export type If = {
  kind: "If"
  condition: Exp
  consequent: Exp
  alternative: Exp
  location?: SourceLocation
}

export function If(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  location?: SourceLocation,
): If {
  return {
    kind: "If",
    condition,
    consequent,
    alternative,
    location,
  }
}

export type When = {
  kind: "When"
  condition: Exp
  consequent: Exp
  location?: SourceLocation
}

export function When(
  condition: Exp,
  consequent: Exp,
  location?: SourceLocation,
): When {
  return {
    kind: "When",
    condition,
    consequent,
    location,
  }
}

export type Unless = {
  kind: "Unless"
  condition: Exp
  alternative: Exp
  location?: SourceLocation
}

export function Unless(
  condition: Exp,
  alternative: Exp,
  location?: SourceLocation,
): Unless {
  return {
    kind: "Unless",
    condition,
    alternative,
    location,
  }
}

export type And = {
  kind: "And"
  exps: Array<Exp>
  location?: SourceLocation
}

export function And(exps: Array<Exp>, location?: SourceLocation): And {
  return {
    kind: "And",
    exps,
    location,
  }
}

export type Or = {
  kind: "Or"
  exps: Array<Exp>
  location?: SourceLocation
}

export function Or(exps: Array<Exp>, location?: SourceLocation): Or {
  return {
    kind: "Or",
    exps,
    location,
  }
}

export type Cond = {
  kind: "Cond"
  clauses: Array<CondClause>
  location?: SourceLocation
}

export type CondClause = {
  question: Exp
  answer: Exp
  location?: SourceLocation
}

export function CondClause(
  question: Exp,
  answer: Exp,
  location?: SourceLocation,
): CondClause {
  return {
    question,
    answer,
    location,
  }
}

export function Cond(
  clauses: Array<CondClause>,
  location?: SourceLocation,
): Cond {
  return {
    kind: "Cond",
    clauses,
    location,
  }
}

export type LiteralList = {
  kind: "LiteralList"
  elements: Array<Exp>
  location?: SourceLocation
}

export function LiteralList(
  elements: Array<Exp>,
  location?: SourceLocation,
): LiteralList {
  return {
    kind: "LiteralList",
    elements,
    location,
  }
}

export type LiteralRecord = {
  kind: "LiteralRecord"
  attributes: Record<string, Exp>
  location?: SourceLocation
}

export function LiteralRecord(
  attributes: Record<string, Exp>,
  location?: SourceLocation,
): LiteralRecord {
  return {
    kind: "LiteralRecord",
    attributes,
    location,
  }
}

export type LiteralSet = {
  kind: "LiteralSet"
  elements: Array<Exp>
  location?: SourceLocation
}

export function LiteralSet(
  elements: Array<Exp>,
  location?: SourceLocation,
): LiteralSet {
  return {
    kind: "LiteralSet",
    elements,
    location,
  }
}

export type LiteralHash = {
  kind: "LiteralHash"
  entries: Array<{ key: Exp; value: Exp }>
  location?: SourceLocation
}

export function LiteralHash(
  entries: Array<{ key: Exp; value: Exp }>,
  location?: SourceLocation,
): LiteralHash {
  return {
    kind: "LiteralHash",
    entries,
    location,
  }
}

export type Quote = {
  kind: "Quote"
  sexp: Sexp
  location?: SourceLocation
}

export function Quote(sexp: Sexp, location?: SourceLocation): Quote {
  return {
    kind: "Quote",
    sexp,
    location,
  }
}

export type Arrow = {
  kind: "Arrow"
  argTypes: Array<Exp>
  retType: Exp
  location?: SourceLocation
}

export function Arrow(
  argTypes: Array<Exp>,
  retType: Exp,
  location?: SourceLocation,
): Arrow {
  return {
    kind: "Arrow",
    argTypes,
    retType,
    location,
  }
}

export type Interface = {
  kind: "Interface"
  attributeTypes: Record<string, Exp>
  location?: SourceLocation
}

export function Interface(
  attributeTypes: Record<string, Exp>,
  location?: SourceLocation,
): Interface {
  return {
    kind: "Interface",
    attributeTypes,
    location,
  }
}

export type ExtendInterface = {
  kind: "ExtendInterface"
  baseType: Exp
  attributeTypes: Record<string, Exp>
  location?: SourceLocation
}

export function ExtendInterface(
  baseType: Exp,
  attributeTypes: Record<string, Exp>,
  location?: SourceLocation,
): ExtendInterface {
  return {
    kind: "ExtendInterface",
    baseType,
    attributeTypes,
    location,
  }
}

export type Extend = {
  kind: "Extend"
  base: Exp
  attributes: Record<string, Exp>
  location?: SourceLocation
}

export function Extend(
  base: Exp,
  attributes: Record<string, Exp>,
  location?: SourceLocation,
): Extend {
  return {
    kind: "Extend",
    base,
    attributes,
    location,
  }
}

export type Update = {
  kind: "Update"
  base: Exp
  attributes: Record<string, Exp>
  location?: SourceLocation
}

export function Update(
  base: Exp,
  attributes: Record<string, Exp>,
  location?: SourceLocation,
): Update {
  return {
    kind: "Update",
    base,
    attributes,
    location,
  }
}

export type UpdateMut = {
  kind: "UpdateMut"
  base: Exp
  attributes: Record<string, Exp>
  location?: SourceLocation
}

export function UpdateMut(
  base: Exp,
  attributes: Record<string, Exp>,
  location?: SourceLocation,
): UpdateMut {
  return {
    kind: "UpdateMut",
    base,
    attributes,
    location,
  }
}

export type The = {
  kind: "The"
  type: Exp
  exp: Exp
  location?: SourceLocation
}

export function The(type: Exp, exp: Exp, location?: SourceLocation): The {
  return {
    kind: "The",
    type,
    exp,
    location,
  }
}

export type Polymorphic = {
  kind: "Polymorphic"
  parameters: Array<string>
  body: Exp
  location?: SourceLocation
}

export function Polymorphic(
  parameters: Array<string>,
  body: Exp,
  location?: SourceLocation,
): Polymorphic {
  return {
    kind: "Polymorphic",
    parameters,
    body,
    location,
  }
}

export type Match = {
  kind: "Match"
  targets: Array<Exp>
  clauses: Array<MatchClause>
  location?: SourceLocation
}

export type MatchClause = {
  patterns: Array<Exp>
  body: Exp
  location?: SourceLocation
}

export function MatchClause(
  patterns: Array<Exp>,
  body: Exp,
  location?: SourceLocation,
): MatchClause {
  return {
    patterns,
    body,
    location,
  }
}

export function Match(
  targets: Array<Exp>,
  clauses: Array<MatchClause>,
  location?: SourceLocation,
): Match {
  return {
    kind: "Match",
    targets,
    clauses,
    location,
  }
}
