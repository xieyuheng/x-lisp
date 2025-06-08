import { Span } from "../span/index.ts"

export type Sexp = Cons | Null | Num | Str | Sym

export type Cons = {
  kind: "Cons"
  head: Sexp
  tail: Sexp
  span: Span
}

export function Cons(head: Sexp, tail: Sexp, span: Span): Cons {
  return {
    kind: "Cons",
    head,
    tail,
    span,
  }
}

export type Null = {
  kind: "Null"
  span: Span
}

export function Null(span: Span): Null {
  return {
    kind: "Null",
    span,
  }
}

export type Num = {
  kind: "Num"
  value: number
  span: Span
}

export function Num(value: number, span: Span): Num {
  return {
    kind: "Num",
    value,
    span,
  }
}

export type Str = {
  kind: "Str"
  value: string
  span: Span
}

export function Str(value: string, span: Span): Str {
  return {
    kind: "Str",
    value,
    span,
  }
}

export type Sym = {
  kind: "Sym"
  value: string
  span: Span
}

export function Sym(value: string, span: Span): Sym {
  return {
    kind: "Sym",
    value,
    span,
  }
}
