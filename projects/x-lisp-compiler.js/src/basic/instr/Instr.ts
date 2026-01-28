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
  exp: Exp
}

export function Branch(exp: Exp, meta?: Meta): Branch {
  return {
    kind: "Branch",
    exp,
    meta,
  }
}

export type Goto = {
  kind: "Goto"
  exp: Exp
}

export function Goto(exp: Exp, meta?: Meta): Goto {
  return {
    kind: "Goto",
    exp,
    meta,
  }
}

export type Return = {
  kind: "Return"
  exp: Exp
}

export function Return(exp: Exp, meta?: Meta): Return {
  return {
    kind: "Return",
    exp,
    meta,
  }
}
