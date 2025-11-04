import { type TokenMeta } from "@xieyuheng/x-sexp.js"
import { type Value } from "../value/index.ts"

export type Meta = TokenMeta

export type Instr = Argument | Const | Assert | Return | Goto | Branch | Call

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
  operands: [string]
  meta?: Meta
}

export function Assert(operands: [string], meta?: Meta): Assert {
  return {
    op: "Assert",
    operands,
    meta,
  }
}

export type Return = {
  op: "Return"
  operands: Array<string>
  meta?: Meta
}

export function Return(operands: Array<string>, meta?: Meta): Return {
  return {
    op: "Return",
    operands,
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
  operands: [string]
  thenLabel: string
  elseLabel: string
  meta?: Meta
}

export function Branch(
  operands: [string],
  thenLabel: string,
  elseLabel: string,
  meta?: Meta,
): Branch {
  return {
    op: "Branch",
    operands,
    thenLabel,
    elseLabel,
    meta,
  }
}

export type Call = {
  op: "Call"
  name: string
  operands: Array<string>
  dest?: string
  meta?: Meta
}

export function Call(
  name: string,
  operands: Array<string>,
  dest?: string,
  meta?: Meta,
): Call {
  return {
    op: "Call",
    name,
    operands,
    dest,
    meta,
  }
}
