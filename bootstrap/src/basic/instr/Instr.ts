import { type TokenMeta as Meta } from "@xieyuheng/x-sexp.js"
import { type Value } from "../value/index.ts"

export type Instr =
  | Argument
  | Const
  | Assert
  | Return
  | Goto
  | Branch
  | Call
  | NullaryApply
  | Apply

export type Argument = {
  op: "Argument"
  index: number
  dest: string
  meta?: Meta
}

export function Argument(index: number, dest: string, meta?: Meta): Argument {
  return {
    op: "Argument",
    index,
    dest,
    meta,
  }
}

export type Const = {
  op: "Const"
  value: Value
  dest: string
  meta?: Meta
}

export function Const(value: Value, dest: string, meta?: Meta): Const {
  return {
    op: "Const",
    value,
    dest,
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
  name: string
  args: Array<string>
  dest?: string
  meta?: Meta
}

export function Call(
  name: string,
  args: Array<string>,
  dest?: string,
  meta?: Meta,
): Call {
  return {
    op: "Call",
    name,
    args,
    dest,
    meta,
  }
}

export type NullaryApply = {
  op: "NullaryApply"
  target: string
  dest?: string
  meta?: Meta
}

export function NullaryApply(
  target: string,
  dest?: string,
  meta?: Meta,
): NullaryApply {
  return {
    op: "NullaryApply",
    target,
    dest,
    meta,
  }
}

export type Apply = {
  op: "Apply"
  target: string
  arg: string
  dest?: string
  meta?: Meta
}

export function Apply(
  target: string,
  arg: string,
  dest?: string,
  meta?: Meta,
): Apply {
  return {
    op: "Apply",
    target,
    arg,
    dest,
    meta,
  }
}
