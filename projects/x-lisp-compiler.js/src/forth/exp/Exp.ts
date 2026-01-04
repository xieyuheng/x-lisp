import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Atom } from "../../lisp/exp/Atom.ts"

export type Exp =
  | Atom
  | Sequence
  | Ref
  | Var
  | TailCall
  | Bindings
  | If
  | Return
  | Assert
  | AssertEqual
  | AssertNotEqual
  | Drop
  | Apply
  | TailApply
  | Assign

export type Sequence = {
  kind: "Sequence"
  exps: Array<Exp>
  meta?: Meta
}

export function Sequence(exps: Array<Exp>, meta?: Meta): Sequence {
  return {
    kind: "Sequence",
    exps,
    meta,
  }
}

export type Ref = {
  kind: "Ref"
  name: string
  meta?: Meta
}

export function Ref(name: string, meta?: Meta): Ref {
  return {
    kind: "Ref",
    name,
    meta,
  }
}

export type Var = {
  kind: "Var"
  name: string
  meta?: Meta
}

export function Var(name: string, meta?: Meta): Var {
  return {
    kind: "Var",
    name,
    meta,
  }
}

export type TailCall = {
  kind: "TailCall"
  name: string
  meta?: Meta
}

export function TailCall(name: string, meta?: Meta): TailCall {
  return {
    kind: "TailCall",
    name,
    meta,
  }
}

export type Bindings = {
  kind: "Bindings"
  names: Array<string>
  meta?: Meta
}

export function Bindings(names: Array<string>, meta?: Meta): Bindings {
  return {
    kind: "Bindings",
    names,
    meta,
  }
}

export type If = {
  kind: "If"
  consequent: Exp
  alternative: Exp
  meta?: Meta
}

export function If(consequent: Exp, alternative: Exp, meta?: Meta): If {
  return {
    kind: "If",
    consequent,
    alternative,
    meta,
  }
}

export type Return = {
  kind: "Return"
  meta?: Meta
}

export function Return(meta?: Meta): Return {
  return {
    kind: "Return",
    meta,
  }
}

export type Assert = {
  kind: "Assert"
  meta?: Meta
}

export function Assert(meta?: Meta): Assert {
  return {
    kind: "Assert",
    meta,
  }
}

export type AssertEqual = {
  kind: "AssertEqual"
  meta?: Meta
}

export function AssertEqual(meta?: Meta): AssertEqual {
  return {
    kind: "AssertEqual",
    meta,
  }
}

export type AssertNotEqual = {
  kind: "AssertNotEqual"
  meta?: Meta
}

export function AssertNotEqual(meta?: Meta): AssertNotEqual {
  return {
    kind: "AssertNotEqual",
    meta,
  }
}

export type Drop = {
  kind: "Drop"
  meta?: Meta
}

export function Drop(meta?: Meta): Drop {
  return {
    kind: "Drop",
    meta,
  }
}

export type Apply = {
  kind: "Apply"
  meta?: Meta
}

export function Apply(meta?: Meta): Apply {
  return {
    kind: "Apply",
    meta,
  }
}

export type TailApply = {
  kind: "TailApply"
  meta?: Meta
}

export function TailApply(meta?: Meta): TailApply {
  return {
    kind: "TailApply",
    meta,
  }
}

export type Assign = {
  kind: "Assign"
  meta?: Meta
}

export function Assign(meta?: Meta): Assign {
  return {
    kind: "Assign",
    meta,
  }
}
