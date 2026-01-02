import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Atom } from "./Atom.ts"

export type Exp =
  | Atom
  | Var
  | FunctionRef
  | ConstantRef
  | Lambda
  | ApplySugar
  | ApplyNullary
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
  attributes: {
    isPrimitive: boolean
  }
  meta?: Meta
}

export function FunctionRef(
  name: string,
  arity: number,
  attributes: {
    isPrimitive: boolean
  },
  meta?: Meta,
): FunctionRef {
  return {
    kind: "FunctionRef",
    name,
    arity,
    attributes,
    meta,
  }
}

export type ConstantRef = {
  kind: "ConstantRef"
  name: string
  attributes: {
    isPrimitive: boolean
  }
  meta?: Meta
}

export function ConstantRef(
  name: string,
  attributes: {
    isPrimitive: boolean
  },
  meta?: Meta,
): ConstantRef {
  return {
    kind: "ConstantRef",
    name,
    attributes,
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

export type ApplySugar = {
  kind: "ApplySugar"
  target: Exp
  args: Array<Exp>
  meta?: Meta
}

export function ApplySugar(
  target: Exp,
  args: Array<Exp>,
  meta?: Meta,
): ApplySugar {
  return {
    kind: "ApplySugar",
    target,
    args,
    meta,
  }
}

export type ApplyNullary = {
  kind: "ApplyNullary"
  target: Exp
  meta?: Meta
}

export function ApplyNullary(target: Exp, meta?: Meta): ApplyNullary {
  return {
    kind: "ApplyNullary",
    target,
    meta,
  }
}

export type Apply = {
  kind: "Apply"
  target: Exp
  arg: Exp
  meta?: Meta
}

export function Apply(target: Exp, arg: Exp, meta?: Meta): Apply {
  return {
    kind: "Apply",
    target,
    arg,
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
