import { type Sexp, type SourceLocation } from "@xieyuheng/sexp.js"

export type Exp =
  | SymbolExp
  | KeywordExp
  | StringExp
  | IntExp
  | FloatExp
  | VarExp
  | QualifiedVarExp
  | LambdaExp
  | ApplyExp
  | PipeExp
  | ChainExp
  | ComposeExp
  | Let1Exp
  | LetExp
  | LetStarExp
  | LetrecStarExp
  | LetrecExp
  | LocalDefineExp
  | Begin1Exp
  | BeginExp
  | AssignExp
  | IfExp
  | WhenExp
  | UnlessExp
  | AndExp
  | OrExp
  | CondExp
  | ListExp
  | SetExp
  | HashExp
  | QuoteExp
  | ArrowExp
  | TheExp
  | PolymorphicExp
  | MatchExp

export type SymbolExp = {
  kind: "SymbolExp"
  content: string
  location: SourceLocation
}

export function SymbolExp(
  content: string,
  location: SourceLocation,
): SymbolExp {
  return {
    kind: "SymbolExp",
    content,
    location,
  }
}

export type StringExp = {
  kind: "StringExp"
  content: string
  location: SourceLocation
}

export function StringExp(
  content: string,
  location: SourceLocation,
): StringExp {
  return {
    kind: "StringExp",
    content,
    location,
  }
}

export type KeywordExp = {
  kind: "KeywordExp"
  content: string
  location: SourceLocation
}

export function KeywordExp(
  content: string,
  location: SourceLocation,
): KeywordExp {
  return {
    kind: "KeywordExp",
    content,
    location,
  }
}

export type IntExp = {
  kind: "IntExp"
  content: bigint
  location: SourceLocation
}

export function IntExp(content: bigint, location: SourceLocation): IntExp {
  return {
    kind: "IntExp",
    content,
    location,
  }
}

export type FloatExp = {
  kind: "FloatExp"
  content: number
  location: SourceLocation
}

export function FloatExp(content: number, location: SourceLocation): FloatExp {
  return {
    kind: "FloatExp",
    content,
    location,
  }
}

export type VarExp = {
  kind: "VarExp"
  name: string
  location: SourceLocation
}

export function VarExp(name: string, location: SourceLocation): VarExp {
  return {
    kind: "VarExp",
    name,
    location,
  }
}

export type QualifiedVarExp = {
  kind: "QualifiedVarExp"
  modName: string
  name: string
  location: SourceLocation
}

export function QualifiedVarExp(
  modName: string,
  name: string,
  location: SourceLocation,
): QualifiedVarExp {
  return {
    kind: "QualifiedVarExp",
    modName,
    name,
    location,
  }
}

export type LambdaExp = {
  kind: "LambdaExp"
  parameters: Array<string>
  body: Exp
  location: SourceLocation
}

export function LambdaExp(
  parameters: Array<string>,
  body: Exp,
  location: SourceLocation,
): LambdaExp {
  return {
    kind: "LambdaExp",
    parameters,
    body,
    location,
  }
}

export type ApplyExp = {
  kind: "ApplyExp"
  target: Exp
  args: Array<Exp>
  location: SourceLocation
}

export function ApplyExp(
  target: Exp,
  args: Array<Exp>,
  location: SourceLocation,
): ApplyExp {
  return {
    kind: "ApplyExp",
    target,
    args,
    location,
  }
}

export type PipeExp = {
  kind: "PipeExp"
  target: Exp
  steps: Array<Exp>
  location: SourceLocation
}

export function PipeExp(
  target: Exp,
  steps: Array<Exp>,
  location: SourceLocation,
): PipeExp {
  return {
    kind: "PipeExp",
    target,
    steps,
    location,
  }
}

export type ChainExp = {
  kind: "ChainExp"
  steps: Array<Exp>
  location: SourceLocation
}

export function ChainExp(
  steps: Array<Exp>,
  location: SourceLocation,
): ChainExp {
  return {
    kind: "ChainExp",
    steps,
    location,
  }
}

export type ComposeExp = {
  kind: "ComposeExp"
  steps: Array<Exp>
  location: SourceLocation
}

export function ComposeExp(
  steps: Array<Exp>,
  location: SourceLocation,
): ComposeExp {
  return {
    kind: "ComposeExp",
    steps,
    location,
  }
}

export type Let1Exp = {
  kind: "Let1Exp"
  name: string
  rhs: Exp
  body: Exp
  location: SourceLocation
}

export function Let1Exp(
  name: string,
  rhs: Exp,
  body: Exp,
  location: SourceLocation,
): Let1Exp {
  return {
    kind: "Let1Exp",
    name,
    rhs,
    body,
    location,
  }
}

export type Binding = {
  name: string
  rhs: Exp
  location: SourceLocation
}

export function Binding(
  name: string,
  rhs: Exp,
  location: SourceLocation,
): Binding {
  return {
    name,
    rhs,
    location,
  }
}

export type LetExp = {
  kind: "LetExp"
  bindings: Array<Binding>
  body: Exp
  location: SourceLocation
}

export function LetExp(
  bindings: Array<Binding>,
  body: Exp,
  location: SourceLocation,
): LetExp {
  return {
    kind: "LetExp",
    bindings,
    body,
    location,
  }
}

export type LetStarExp = {
  kind: "LetStarExp"
  bindings: Array<Binding>
  body: Exp
  location: SourceLocation
}

export function LetStarExp(
  bindings: Array<Binding>,
  body: Exp,
  location: SourceLocation,
): LetStarExp {
  return {
    kind: "LetStarExp",
    bindings,
    body,
    location,
  }
}

export type LetrecStarExp = {
  kind: "LetrecStarExp"
  bindings: Array<Binding>
  body: Exp
  location: SourceLocation
}

export function LetrecStarExp(
  bindings: Array<Binding>,
  body: Exp,
  location: SourceLocation,
): LetrecStarExp {
  return {
    kind: "LetrecStarExp",
    bindings,
    body,
    location,
  }
}

export type LetrecExp = {
  kind: "LetrecExp"
  bindings: Array<Binding>
  body: Exp
  location: SourceLocation
}

export function LetrecExp(
  bindings: Array<Binding>,
  body: Exp,
  location: SourceLocation,
): LetrecExp {
  return {
    kind: "LetrecExp",
    bindings,
    body,
    location,
  }
}

export type LocalDefineExp = {
  kind: "LocalDefineExp"
  name: string
  parameters: Array<string>
  body: Exp
  location: SourceLocation
}

export function LocalDefineExp(
  name: string,
  parameters: Array<string>,
  body: Exp,
  location: SourceLocation,
): LocalDefineExp {
  return {
    kind: "LocalDefineExp",
    name,
    parameters,
    body,
    location,
  }
}

export type Begin1Exp = {
  kind: "Begin1Exp"
  head: Exp
  body: Exp
  location: SourceLocation
}

export function Begin1Exp(
  head: Exp,
  body: Exp,
  location: SourceLocation,
): Begin1Exp {
  return {
    kind: "Begin1Exp",
    head,
    body,
    location,
  }
}

export type BeginExp = {
  kind: "BeginExp"
  sequence: Array<Exp>
  location: SourceLocation
}

export function BeginExp(
  sequence: Array<Exp>,
  location: SourceLocation,
): BeginExp {
  return {
    kind: "BeginExp",
    sequence,
    location,
  }
}

export type AssignExp = {
  kind: "AssignExp"
  name: string
  rhs: Exp
  location: SourceLocation
}

export function AssignExp(
  name: string,
  rhs: Exp,
  location: SourceLocation,
): AssignExp {
  return {
    kind: "AssignExp",
    name,
    rhs,
    location,
  }
}

export type IfExp = {
  kind: "IfExp"
  condition: Exp
  consequent: Exp
  alternative: Exp
  location: SourceLocation
}

export function IfExp(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  location: SourceLocation,
): IfExp {
  return {
    kind: "IfExp",
    condition,
    consequent,
    alternative,
    location,
  }
}

export type WhenExp = {
  kind: "WhenExp"
  condition: Exp
  consequent: Exp
  location: SourceLocation
}

export function WhenExp(
  condition: Exp,
  consequent: Exp,
  location: SourceLocation,
): WhenExp {
  return {
    kind: "WhenExp",
    condition,
    consequent,
    location,
  }
}

export type UnlessExp = {
  kind: "UnlessExp"
  condition: Exp
  alternative: Exp
  location: SourceLocation
}

export function UnlessExp(
  condition: Exp,
  alternative: Exp,
  location: SourceLocation,
): UnlessExp {
  return {
    kind: "UnlessExp",
    condition,
    alternative,
    location,
  }
}

export type AndExp = {
  kind: "AndExp"
  exps: Array<Exp>
  location: SourceLocation
}

export function AndExp(exps: Array<Exp>, location: SourceLocation): AndExp {
  return {
    kind: "AndExp",
    exps,
    location,
  }
}

export type OrExp = {
  kind: "OrExp"
  exps: Array<Exp>
  location: SourceLocation
}

export function OrExp(exps: Array<Exp>, location: SourceLocation): OrExp {
  return {
    kind: "OrExp",
    exps,
    location,
  }
}

export type CondExp = {
  kind: "CondExp"
  clauses: Array<CondClause>
  location: SourceLocation
}

export type CondClause = {
  question: Exp
  answer: Exp
  location: SourceLocation
}

export function CondClause(
  question: Exp,
  answer: Exp,
  location: SourceLocation,
): CondClause {
  return {
    question,
    answer,
    location,
  }
}

export function CondExp(
  clauses: Array<CondClause>,
  location: SourceLocation,
): CondExp {
  return {
    kind: "CondExp",
    clauses,
    location,
  }
}

export type ListExp = {
  kind: "ListExp"
  elements: Array<Exp>
  location: SourceLocation
}

export function ListExp(
  elements: Array<Exp>,
  location: SourceLocation,
): ListExp {
  return {
    kind: "ListExp",
    elements,
    location,
  }
}

export type SetExp = {
  kind: "SetExp"
  elements: Array<Exp>
  location: SourceLocation
}

export function SetExp(elements: Array<Exp>, location: SourceLocation): SetExp {
  return {
    kind: "SetExp",
    elements,
    location,
  }
}

export type HashExp = {
  kind: "HashExp"
  entries: Array<{ key: Exp; value: Exp }>
  location: SourceLocation
}

export function HashExp(
  entries: Array<{ key: Exp; value: Exp }>,
  location: SourceLocation,
): HashExp {
  return {
    kind: "HashExp",
    entries,
    location,
  }
}

export type QuoteExp = {
  kind: "QuoteExp"
  sexp: Sexp
  location: SourceLocation
}

export function QuoteExp(sexp: Sexp, location: SourceLocation): QuoteExp {
  return {
    kind: "QuoteExp",
    sexp,
    location,
  }
}

export type ArrowExp = {
  kind: "ArrowExp"
  argTypes: Array<Exp>
  retType: Exp
  location: SourceLocation
}

export function ArrowExp(
  argTypes: Array<Exp>,
  retType: Exp,
  location: SourceLocation,
): ArrowExp {
  return {
    kind: "ArrowExp",
    argTypes,
    retType,
    location,
  }
}

export type TheExp = {
  kind: "TheExp"
  type: Exp
  instance: Exp
  location: SourceLocation
}

export function TheExp(
  type: Exp,
  instance: Exp,
  location: SourceLocation,
): TheExp {
  return {
    kind: "TheExp",
    type,
    instance,
    location,
  }
}

export type PolymorphicExp = {
  kind: "PolymorphicExp"
  parameters: Array<string>
  body: Exp
  location: SourceLocation
}

export function PolymorphicExp(
  parameters: Array<string>,
  body: Exp,
  location: SourceLocation,
): PolymorphicExp {
  return {
    kind: "PolymorphicExp",
    parameters,
    body,
    location,
  }
}

export type MatchExp = {
  kind: "MatchExp"
  targets: Array<Exp>
  clauses: Array<MatchClause>
  location: SourceLocation
}

export type MatchClause = {
  patterns: Array<Exp>
  body: Exp
  location: SourceLocation
}

export function MatchClause(
  patterns: Array<Exp>,
  body: Exp,
  location: SourceLocation,
): MatchClause {
  return {
    patterns,
    body,
    location,
  }
}

export function MatchExp(
  targets: Array<Exp>,
  clauses: Array<MatchClause>,
  location: SourceLocation,
): MatchExp {
  return {
    kind: "MatchExp",
    targets,
    clauses,
    location,
  }
}
