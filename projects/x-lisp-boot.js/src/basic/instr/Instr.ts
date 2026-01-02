import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import { FunctionRef, type Value } from "../value/index.ts"

export type Instr =
  | Argument
  | Literal
  | Identity
  | Assert
  | Return
  | Goto
  | Branch
  | Call
  | ApplyNullary
  | Apply
  | Load
  | Store

export type Argument = {
  op: "Argument"
  dest: string
  index: number
  meta?: Meta
}

export function Argument(dest: string, index: number, meta?: Meta): Argument {
  return {
    op: "Argument",
    dest,
    index,
    meta,
  }
}

export type Literal = {
  op: "Literal"
  dest: string
  value: Value
  meta?: Meta
}

export function Literal(dest: string, value: Value, meta?: Meta): Literal {
  return {
    op: "Literal",
    dest,
    value,
    meta,
  }
}

export type Identity = {
  op: "Identity"
  dest: string
  source: string
  meta?: Meta
}

export function Identity(dest: string, source: string, meta?: Meta): Identity {
  return {
    op: "Identity",
    dest,
    source,
    meta,
  }
}

export type Assert = {
  op: "Assert"
  condition: string
  meta?: Meta
}

export function Assert(condition: string, meta?: Meta): Assert {
  return {
    op: "Assert",
    condition,
    meta,
  }
}

export type Return = {
  op: "Return"
  result?: string
  meta?: Meta
}

export function Return(result?: string, meta?: Meta): Return {
  return {
    op: "Return",
    result,
    meta,
  }
}

export type Goto = {
  op: "Goto"
  label: string
  meta?: Meta
}

export function Goto(label: string, meta?: Meta): Goto {
  return {
    op: "Goto",
    label,
    meta,
  }
}

export type Branch = {
  op: "Branch"
  condition: string
  thenLabel: string
  elseLabel: string
  meta?: Meta
}

export function Branch(
  condition: string,
  thenLabel: string,
  elseLabel: string,
  meta?: Meta,
): Branch {
  return {
    op: "Branch",
    condition,
    thenLabel,
    elseLabel,
    meta,
  }
}

export type Call = {
  op: "Call"
  dest: string
  fn: FunctionRef
  args: Array<string>
  meta?: Meta
}

export function Call(
  dest: string,
  fn: FunctionRef,
  args: Array<string>,
  meta?: Meta,
): Call {
  return {
    op: "Call",
    dest,
    fn,
    args,
    meta,
  }
}

export type ApplyNullary = {
  op: "ApplyNullary"
  dest: string
  target: string
  meta?: Meta
}

export function ApplyNullary(
  dest: string,
  target: string,
  meta?: Meta,
): ApplyNullary {
  return {
    op: "ApplyNullary",
    dest,
    target,
    meta,
  }
}

export type Apply = {
  op: "Apply"
  dest: string
  target: string
  arg: string
  meta?: Meta
}

export function Apply(
  dest: string,
  target: string,
  arg: string,
  meta?: Meta,
): Apply {
  return {
    op: "Apply",
    dest,
    target,
    arg,
    meta,
  }
}

export type Load = {
  op: "Load"
  dest: string
  name: string
  meta?: Meta
}

export function Load(dest: string, name: string, meta?: Meta): Load {
  return {
    op: "Load",
    dest,
    name,
    meta,
  }
}

export type Store = {
  op: "Store"
  name: string
  source: string
  meta?: Meta
}

export function Store(name: string, source: string, meta?: Meta): Store {
  return {
    op: "Store",
    name,
    source,
    meta,
  }
}
