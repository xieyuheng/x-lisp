import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Atom } from "./Atom.ts"

export type Exp =
  | Atom
  | Var
  | FunctionRef
  | PrimitiveRef
  | ConstantRef
  | Lambda
  | Apply
  | Let1
  | BeginSugar
  | AssignSugar
  | If
  | When
  | Unless
  | And
  | Or

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

export type PrimitiveRef = {
  kind: "PrimitiveRef"
  name: string
  arity: number
  meta?: Meta
}

export function PrimitiveRef(
  name: string,
  arity: number,
  meta?: Meta,
): PrimitiveRef {
  return {
    kind: "PrimitiveRef",
    name,
    arity,
    meta,
  }
}

export type ConstantRef = {
  kind: "ConstantRef"
  name: string
  meta?: Meta
}

export function ConstantRef(
  name: string,
  meta?: Meta,
): ConstantRef {
  return {
    kind: "ConstantRef",
    name,
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

export function Apply(
  target: Exp,
  args: Array<Exp>,
  meta?: Meta,
): Apply {
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

export type When = {
  kind: "When"
  condition: Exp
  consequent: Exp
  meta?: Meta
}

export function When(condition: Exp, consequent: Exp, meta?: Meta): When {
  return {
    kind: "When",
    condition,
    consequent,
    meta,
  }
}

export type Unless = {
  kind: "Unless"
  condition: Exp
  consequent: Exp
  meta?: Meta
}

export function Unless(condition: Exp, consequent: Exp, meta?: Meta): Unless {
  return {
    kind: "Unless",
    condition,
    consequent,
    meta,
  }
}

export type And = {
  kind: "And"
  exps: Array<Exp>
  meta?: Meta
}

export function And(exps: Array<Exp>, meta?: Meta): And {
  return {
    kind: "And",
    exps,
    meta,
  }
}

export type Or = {
  kind: "Or"
  exps: Array<Exp>
  meta?: Meta
}

export function Or(exps: Array<Exp>, meta?: Meta): Or {
  return {
    kind: "Or",
    exps,
    meta,
  }
}
