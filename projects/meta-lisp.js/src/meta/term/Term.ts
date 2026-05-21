import type { SourceLocation } from "@xieyuheng/sexp.js"

export type Term =
  | SymbolTerm
  | KeywordTerm
  | StringTerm
  | IntTerm
  | FloatTerm
  | VarTerm
  | QualifiedVarTerm
  | LambdaTerm
  | ApplyTerm
  | Let1Term
  | Begin1Term
  | IfTerm
  | ArrowTerm
  | TheTerm
  | PolymorphicTerm

export type SymbolTerm = {
  kind: "SymbolTerm"
  content: string
  location: SourceLocation
}

export function SymbolTerm(
  content: string,
  location: SourceLocation,
): SymbolTerm {
  return {
    kind: "SymbolTerm",
    content,
    location,
  }
}

export type KeywordTerm = {
  kind: "KeywordTerm"
  content: string
  location: SourceLocation
}

export function KeywordTerm(
  content: string,
  location: SourceLocation,
): KeywordTerm {
  return {
    kind: "KeywordTerm",
    content,
    location,
  }
}

export type StringTerm = {
  kind: "StringTerm"
  content: string
  location: SourceLocation
}

export function StringTerm(
  content: string,
  location: SourceLocation,
): StringTerm {
  return {
    kind: "StringTerm",
    content,
    location,
  }
}

export type IntTerm = {
  kind: "IntTerm"
  content: bigint
  location: SourceLocation
}

export function IntTerm(content: bigint, location: SourceLocation): IntTerm {
  return {
    kind: "IntTerm",
    content,
    location,
  }
}

export type FloatTerm = {
  kind: "FloatTerm"
  content: number
  location: SourceLocation
}

export function FloatTerm(
  content: number,
  location: SourceLocation,
): FloatTerm {
  return {
    kind: "FloatTerm",
    content,
    location,
  }
}

export type VarTerm = {
  kind: "VarTerm"
  name: string
  location: SourceLocation
}

export function VarTerm(name: string, location: SourceLocation): VarTerm {
  return {
    kind: "VarTerm",
    name,
    location,
  }
}

export type QualifiedVarTerm = {
  kind: "QualifiedVarTerm"
  modName: string
  name: string
  location: SourceLocation
}

export function QualifiedVarTerm(
  modName: string,
  name: string,
  location: SourceLocation,
): QualifiedVarTerm {
  return {
    kind: "QualifiedVarTerm",
    modName,
    name,
    location,
  }
}

export type LambdaTerm = {
  kind: "LambdaTerm"
  parameters: Array<string>
  body: Term
  location: SourceLocation
}

export function LambdaTerm(
  parameters: Array<string>,
  body: Term,
  location: SourceLocation,
): LambdaTerm {
  return {
    kind: "LambdaTerm",
    parameters,
    body,
    location,
  }
}

export type ApplyTerm = {
  kind: "ApplyTerm"
  target: Term
  args: Array<Term>
  location: SourceLocation
}

export function ApplyTerm(
  target: Term,
  args: Array<Term>,
  location: SourceLocation,
): ApplyTerm {
  return {
    kind: "ApplyTerm",
    target,
    args,
    location,
  }
}

export type Let1Term = {
  kind: "Let1Term"
  name: string
  rhs: Term
  body: Term
  location: SourceLocation
}

export function Let1Term(
  name: string,
  rhs: Term,
  body: Term,
  location: SourceLocation,
): Let1Term {
  return {
    kind: "Let1Term",
    name,
    rhs,
    body,
    location,
  }
}

export type Begin1Term = {
  kind: "Begin1Term"
  head: Term
  body: Term
  location: SourceLocation
}

export function Begin1Term(
  head: Term,
  body: Term,
  location: SourceLocation,
): Begin1Term {
  return {
    kind: "Begin1Term",
    head,
    body,
    location,
  }
}

export type IfTerm = {
  kind: "IfTerm"
  condition: Term
  consequent: Term
  alternative: Term
  location: SourceLocation
}

export function IfTerm(
  condition: Term,
  consequent: Term,
  alternative: Term,
  location: SourceLocation,
): IfTerm {
  return {
    kind: "IfTerm",
    condition,
    consequent,
    alternative,
    location,
  }
}

export type ArrowTerm = {
  kind: "ArrowTerm"
  argTypes: Array<Term>
  retType: Term
  location: SourceLocation
}

export function ArrowTerm(
  argTypes: Array<Term>,
  retType: Term,
  location: SourceLocation,
): ArrowTerm {
  return {
    kind: "ArrowTerm",
    argTypes,
    retType,
    location,
  }
}

export type TheTerm = {
  kind: "TheTerm"
  type: Term
  exp: Term
  location: SourceLocation
}

export function TheTerm(
  type: Term,
  exp: Term,
  location: SourceLocation,
): TheTerm {
  return {
    kind: "TheTerm",
    type,
    exp,
    location,
  }
}

export type PolymorphicTerm = {
  kind: "PolymorphicTerm"
  parameters: Array<string>
  body: Term
  location: SourceLocation
}

export function PolymorphicTerm(
  parameters: Array<string>,
  body: Term,
  location: SourceLocation,
): PolymorphicTerm {
  return {
    kind: "PolymorphicTerm",
    parameters,
    body,
    location,
  }
}

export type TermBinding = {
  name: string
  rhs: Term
  location: SourceLocation
}

export function TermBinding(
  name: string,
  rhs: Term,
  location: SourceLocation,
): TermBinding {
  return {
    name,
    rhs,
    location,
  }
}

export type TermCondClause = {
  question: Term
  answer: Term
  location: SourceLocation
}

export function TermCondClause(
  question: Term,
  answer: Term,
  location: SourceLocation,
): TermCondClause {
  return {
    question,
    answer,
    location,
  }
}
