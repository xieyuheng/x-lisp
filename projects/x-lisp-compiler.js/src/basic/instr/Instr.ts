import { type TokenMeta as Meta } from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"

export type Instr = Assign | Perform | Test | Branch | Goto | Return

export type Assign = {
  kind: "Assign"
  dest: string
  exp: Exp
  meta?: Meta
}

export function Assign(dest: string, exp: Exp, meta?: Meta): Assign {
  return {
    kind: "Assign",
    dest,
    exp,
    meta,
  }
}

export type Perform = {
  kind: "Perform"
  exp: Exp
  meta?: Meta
}

export function Perform(exp: Exp, meta?: Meta): Perform {
  return {
    kind: "Perform",
    exp,
    meta,
  }
}

export type Test = {
  kind: "Test"
  exp: Exp
  meta?: Meta
}

export function Test(exp: Exp, meta?: Meta): Test {
  return {
    kind: "Test",
    exp,
    meta,
  }
}

export type Branch = {
  kind: "Branch"
  thenLabel: string
  elseLabel: string
  meta?: Meta
}

export function Branch(
  thenLabel: string,
  elseLabel: string,
  meta?: Meta,
): Branch {
  return {
    kind: "Branch",
    thenLabel,
    elseLabel,
    meta,
  }
}

export type Goto = {
  kind: "Goto"
  label: string
  meta?: Meta
}

export function Goto(label: string, meta?: Meta): Goto {
  return {
    kind: "Goto",
    label,
    meta,
  }
}

export type Return = {
  kind: "Return"
  exp: Exp
  meta?: Meta
}

export function Return(exp: Exp, meta?: Meta): Return {
  return {
    kind: "Return",
    exp,
    meta,
  }
}
