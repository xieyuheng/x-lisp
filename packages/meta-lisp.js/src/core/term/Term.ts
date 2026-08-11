import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Term =
  | VarTerm
  | QualifiedVarTerm
  | LambdaTerm
  | ApplyTerm
  | Let1Term
  | Begin1Term
  | IfTerm
  | IntTerm
  | FloatTerm
  | StringTerm
  | SymbolTerm
  | ClosureTerm

export type VarTerm = {
  kind: "VarTerm"
  name: string
  location: SourceLocation
}

export function VarTerm(name: string, location: SourceLocation): VarTerm {
  return { kind: "VarTerm", name, location }
}

export type QualifiedVarTerm = {
  kind: "QualifiedVarTerm"
  pkgName: string
  modName: string
  name: string
  location: SourceLocation
}

export function QualifiedVarTerm(
  pkgName: string,
  modName: string,
  name: string,
  location: SourceLocation,
): QualifiedVarTerm {
  return { kind: "QualifiedVarTerm", pkgName, modName, name, location }
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
  return { kind: "LambdaTerm", parameters, body, location }
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
  return { kind: "ApplyTerm", target, args, location }
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
  return { kind: "Let1Term", name, rhs, body, location }
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
  return { kind: "Begin1Term", head, body, location }
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
  return { kind: "IfTerm", condition, consequent, alternative, location }
}

export type IntTerm = {
  kind: "IntTerm"
  content: bigint
  location: SourceLocation
}

export function IntTerm(content: bigint, location: SourceLocation): IntTerm {
  return { kind: "IntTerm", content, location }
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
  return { kind: "FloatTerm", content, location }
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
  return { kind: "StringTerm", content, location }
}

export type SymbolTerm = {
  kind: "SymbolTerm"
  content: string
  location: SourceLocation
}

export function SymbolTerm(
  content: string,
  location: SourceLocation,
): SymbolTerm {
  return { kind: "SymbolTerm", content, location }
}

export type ClosureTerm = {
  kind: "ClosureTerm"
  pkgName: string
  modName: string
  name: string
  args: Array<Term>
  location: SourceLocation
}

export function ClosureTerm(
  pkgName: string,
  modName: string,
  name: string,
  args: Array<Term>,
  location: SourceLocation,
): ClosureTerm {
  return { kind: "ClosureTerm", pkgName, modName, name, args, location }
}
