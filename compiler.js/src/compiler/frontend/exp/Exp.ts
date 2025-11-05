import { type TokenMeta } from "@xieyuheng/x-sexp.js"
import type { Atom } from "./Atom.ts"

type Meta = TokenMeta

export type Exp =
  | Atom
  | Var
  | FunctionRef
  | Lambda
  | Apply
  | Let1
  | BeginSugar
  | AssignSugar
  | If

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

export type FunctionRef = {
  kind: "FunctionRef"
  name: string
  arity: number
  meta?: Meta
}

export function FunctionRef(
  name: string,
  arity: number,
  meta?: Meta,
): FunctionRef {
  return {
    kind: "FunctionRef",
    name,
    arity,
    meta,
  }
}

export type Lambda = {
  kind: "Lambda"
  parameters: Array<string>
  body: Exp
  meta?: Meta
}

export function Lambda(
  parameters: Array<string>,
  body: Exp,
  meta?: Meta,
): Lambda {
  return {
    kind: "Lambda",
    parameters,
    body,
    meta,
  }
}

export type Apply = {
  kind: "Apply"
  target: Exp
  args: Array<Exp>
  meta?: Meta
}

export function Apply(target: Exp, args: Array<Exp>, meta?: Meta): Apply {
  return {
    kind: "Apply",
    target,
    args,
    meta,
  }
}

export type Let1 = {
  kind: "Let1"
  name: string
  rhs: Exp
  body: Exp
  meta?: Meta
}

export function Let1(name: string, rhs: Exp, body: Exp, meta?: Meta): Let1 {
  return {
    kind: "Let1",
    name,
    rhs,
    body,
    meta,
  }
}

export type BeginSugar = {
  kind: "BeginSugar"
  sequence: Array<Exp>
  meta?: Meta
}

export function BeginSugar(sequence: Array<Exp>, meta?: Meta): BeginSugar {
  return {
    kind: "BeginSugar",
    sequence,
    meta,
  }
}

export type AssignSugar = {
  kind: "AssignSugar"
  name: string
  rhs: Exp
  meta?: Meta
}

export function AssignSugar(name: string, rhs: Exp, meta?: Meta): AssignSugar {
  return {
    kind: "AssignSugar",
    name,
    rhs,
    meta,
  }
}

export type If = {
  kind: "If"
  condition: Exp
  consequent: Exp
  alternative: Exp
  meta?: Meta
}

export function If(
  condition: Exp,
  consequent: Exp,
  alternative: Exp,
  meta?: Meta,
): If {
  return {
    kind: "If",
    condition,
    consequent,
    alternative,
    meta,
  }
}
