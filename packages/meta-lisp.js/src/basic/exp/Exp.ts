import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Atom =
  | SymbolExp
  | KeywordExp
  | StringExp
  | IntExp
  | FloatExp
  | VarExp

export type Exp = Atom | ApplyExp

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

export function isVarExp(exp: Exp): exp is VarExp {
  return exp.kind === "VarExp"
}

export function asVarExp(exp: Exp): VarExp {
  if (!isVarExp(exp)) {
    throw new Error(`[asVarExp] fail`)
  }

  return exp
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
