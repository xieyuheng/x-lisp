import { type TokenMeta } from "@xieyuheng/sexp-tael.js"

export type Atom = Symbol | Hashtag | String | Int | Float | Var

export function isAtom(exp: Exp): exp is Atom {
  return (
    exp.kind === "Symbol" ||
    exp.kind === "Hashtag" ||
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

export type Hashtag = {
  kind: "Hashtag"
  content: string
  meta?: TokenMeta
}

export function Hashtag(content: string, meta?: TokenMeta): Hashtag {
  return {
    kind: "Hashtag",
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
