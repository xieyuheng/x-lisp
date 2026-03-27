import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Atom = Symbol | Keyword | String | Int | Float | Var

export function isAtom(exp: Exp): exp is Atom {
  return (
    exp.kind === "Symbol" ||
    exp.kind === "Keyword" ||
    exp.kind === "String" ||
    exp.kind === "Int" ||
    exp.kind === "Float" ||
    exp.kind === "Var"
  )
}

export type Exp = Atom | Apply

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
