import { type TokenMeta } from "@xieyuheng/sexp-tael.js"
import type { Exp } from "../exp/index.ts"

export type Instr = Assign | Perform | Test | Branch | Goto | Return

export type Assign = {
  kind: "Assign"
  dest: string
  exp: Exp
  meta?: TokenMeta
}

export function Assign(dest: string, exp: Exp, meta?: TokenMeta): Assign {
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
  meta?: TokenMeta
}

export function Perform(exp: Exp, meta?: TokenMeta): Perform {
  return {
    kind: "Perform",
    exp,
    meta,
  }
}

export type Test = {
  kind: "Test"
  exp: Exp
  meta?: TokenMeta
}

export function Test(exp: Exp, meta?: TokenMeta): Test {
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
  meta?: TokenMeta
}

export function Branch(
  thenLabel: string,
  elseLabel: string,
  meta?: TokenMeta,
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
  meta?: TokenMeta
}

export function Goto(label: string, meta?: TokenMeta): Goto {
  return {
    kind: "Goto",
    label,
    meta,
  }
}

export type Return = {
  kind: "Return"
  exp: Exp
  meta?: TokenMeta
}

export function Return(exp: Exp, meta?: TokenMeta): Return {
  return {
    kind: "Return",
    exp,
    meta,
  }
}
