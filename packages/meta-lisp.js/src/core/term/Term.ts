import { type SourceLocation } from "@xieyuheng/sexp.js"
import * as M from "../../meta/index.ts"

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
  | KeywordTerm

export type VarTerm = {
  kind: "VarTerm"
  name: string
  type: M.Type
  location: SourceLocation
}

export type QualifiedVarTerm = {
  kind: "QualifiedVarTerm"
  pkgName: string
  modName: string
  name: string
  type: M.Type
  location: SourceLocation
}

export type LambdaTerm = {
  kind: "LambdaTerm"
  parameters: Array<{ name: string; type: M.Type }>
  body: Term
  type: M.Type
  location: SourceLocation
}

export type ApplyTerm = {
  kind: "ApplyTerm"
  target: Term
  args: Array<Term>
  type: M.Type
  location: SourceLocation
}

export type Let1Term = {
  kind: "Let1Term"
  name: string
  rhs: Term
  body: Term
  type: M.Type
  location: SourceLocation
}

export type Begin1Term = {
  kind: "Begin1Term"
  head: Term
  body: Term
  type: M.Type
  location: SourceLocation
}

export type IfTerm = {
  kind: "IfTerm"
  condition: Term
  consequent: Term
  alternative: Term
  type: M.Type
  location: SourceLocation
}

export type IntTerm = {
  kind: "IntTerm"
  content: bigint
  type: M.Type
  location: SourceLocation
}

export type FloatTerm = {
  kind: "FloatTerm"
  content: number
  type: M.Type
  location: SourceLocation
}

export type StringTerm = {
  kind: "StringTerm"
  content: string
  type: M.Type
  location: SourceLocation
}

export type SymbolTerm = {
  kind: "SymbolTerm"
  content: string
  type: M.Type
  location: SourceLocation
}

export type KeywordTerm = {
  kind: "KeywordTerm"
  content: string
  type: M.Type
  location: SourceLocation
}

export function VarTerm(
  name: string,
  type: M.Type,
  location: SourceLocation,
): VarTerm {
  return { kind: "VarTerm", name, type, location }
}

export function QualifiedVarTerm(
  pkgName: string,
  modName: string,
  name: string,
  type: M.Type,
  location: SourceLocation,
): QualifiedVarTerm {
  return { kind: "QualifiedVarTerm", pkgName, modName, name, type, location }
}

export function LambdaTerm(
  parameters: Array<{ name: string; type: M.Type }>,
  body: Term,
  type: M.Type,
  location: SourceLocation,
): LambdaTerm {
  return { kind: "LambdaTerm", parameters, body, type, location }
}

export function ApplyTerm(
  target: Term,
  args: Array<Term>,
  type: M.Type,
  location: SourceLocation,
): ApplyTerm {
  return { kind: "ApplyTerm", target, args, type, location }
}

export function Let1Term(
  name: string,
  rhs: Term,
  body: Term,
  type: M.Type,
  location: SourceLocation,
): Let1Term {
  return { kind: "Let1Term", name, rhs, body, type, location }
}

export function Begin1Term(
  head: Term,
  body: Term,
  type: M.Type,
  location: SourceLocation,
): Begin1Term {
  return { kind: "Begin1Term", head, body, type, location }
}

export function IfTerm(
  condition: Term,
  consequent: Term,
  alternative: Term,
  type: M.Type,
  location: SourceLocation,
): IfTerm {
  return { kind: "IfTerm", condition, consequent, alternative, type, location }
}

export function IntTerm(
  content: bigint,
  type: M.Type,
  location: SourceLocation,
): IntTerm {
  return { kind: "IntTerm", content, type, location }
}

export function FloatTerm(
  content: number,
  type: M.Type,
  location: SourceLocation,
): FloatTerm {
  return { kind: "FloatTerm", content, type, location }
}

export function StringTerm(
  content: string,
  type: M.Type,
  location: SourceLocation,
): StringTerm {
  return { kind: "StringTerm", content, type, location }
}

export function SymbolTerm(
  content: string,
  type: M.Type,
  location: SourceLocation,
): SymbolTerm {
  return { kind: "SymbolTerm", content, type, location }
}

export function KeywordTerm(
  content: string,
  type: M.Type,
  location: SourceLocation,
): KeywordTerm {
  return { kind: "KeywordTerm", content, type, location }
}
