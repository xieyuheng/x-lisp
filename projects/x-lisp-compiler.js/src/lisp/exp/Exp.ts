import { type TokenMeta as Meta, type Sexp } from "@xieyuheng/sexp.js"
import type { Atom } from "./Atom.ts"

export type Attributes = Record<string, Exp>

export type Exp =
  | Atom
  | Var
  | PrimitiveFunctionRef
  | PrimitiveConstantRef
  | FunctionRef
  | ConstantRef
  | Lambda
  | Apply
  | Let1
  | Begin1
  | BeginSugar
  | AssignSugar
  | If
  | When
  | Unless
  | And
  | Or
  | Assert
  | AssertEqual
  | AssertNotEqual
  | Tael
  | Set
  | Hash
  | Quote

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

export type PrimitiveFunctionRef = {
  kind: "PrimitiveFunctionRef"
  name: string
  arity: number
  meta?: Meta
}

export function PrimitiveFunctionRef(
  name: string,
  arity: number,
  meta?: Meta,
): PrimitiveFunctionRef {
  return {
    kind: "PrimitiveFunctionRef",
    name,
    arity,
    meta,
  }
}

export type PrimitiveConstantRef = {
  kind: "PrimitiveConstantRef"
  name: string
  meta?: Meta
}

export function PrimitiveConstantRef(
  name: string,
  meta?: Meta,
): PrimitiveConstantRef {
  return {
    kind: "PrimitiveConstantRef",
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

export type ConstantRef = {
  kind: "ConstantRef"
  name: string
  meta?: Meta
}

export function ConstantRef(name: string, meta?: Meta): ConstantRef {
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

export type Begin1 = {
  kind: "Begin1"
  head: Exp
  body: Exp
  meta?: Meta
}

export function Begin1(head: Exp, body: Exp, meta?: Meta): Begin1 {
  return {
    kind: "Begin1",
    head,
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

export type Assert = {
  kind: "Assert"
  target: Exp
  meta?: Meta
}

export function Assert(target: Exp, meta?: Meta): Assert {
  return {
    kind: "Assert",
    target,
    meta,
  }
}

export type AssertEqual = {
  kind: "AssertEqual"
  lhs: Exp
  rhs: Exp
  meta?: Meta
}

export function AssertEqual(lhs: Exp, rhs: Exp, meta?: Meta): AssertEqual {
  return {
    kind: "AssertEqual",
    lhs,
    rhs,
    meta,
  }
}

export type AssertNotEqual = {
  kind: "AssertNotEqual"
  lhs: Exp
  rhs: Exp
  meta?: Meta
}

export function AssertNotEqual(
  lhs: Exp,
  rhs: Exp,
  meta?: Meta,
): AssertNotEqual {
  return {
    kind: "AssertNotEqual",
    lhs,
    rhs,
    meta,
  }
}

export type Tael = {
  kind: "Tael"
  elements: Array<Exp>
  attributes: Attributes
  meta: Meta
}

export function Tael(
  elements: Array<Exp>,
  attributes: Attributes,
  meta: Meta,
): Tael {
  return {
    kind: "Tael",
    elements,
    attributes,
    meta,
  }
}

export type Set = {
  kind: "Set"
  elements: Array<Exp>
  meta: Meta
}

export function Set(elements: Array<Exp>, meta: Meta): Set {
  return {
    kind: "Set",
    elements,
    meta,
  }
}

export type Hash = {
  kind: "Hash"
  entries: Array<{ key: Exp; value: Exp }>
  meta: Meta
}

export function Hash(
  entries: Array<{ key: Exp; value: Exp }>,
  meta: Meta,
): Hash {
  return {
    kind: "Hash",
    entries,
    meta,
  }
}

export type Quote = {
  kind: "Quote"
  sexp: Sexp
  meta?: Meta
}

export function Quote(sexp: Sexp, meta?: Meta): Quote {
  return {
    kind: "Quote",
    sexp,
    meta,
  }
}
