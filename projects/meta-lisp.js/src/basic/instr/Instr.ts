import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"

export type Instr = Assign | Perform | Test | Branch | Goto | Return

export type Assign = {
  kind: "Assign"
  dest: string
  exp: Exp
  meta?: SourceLocation
}

export function Assign(dest: string, exp: Exp, meta?: SourceLocation): Assign {
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
  meta?: SourceLocation
}

export function Perform(exp: Exp, meta?: SourceLocation): Perform {
  return {
    kind: "Perform",
    exp,
    meta,
  }
}

export type Test = {
  kind: "Test"
  exp: Exp
  meta?: SourceLocation
}

export function Test(exp: Exp, meta?: SourceLocation): Test {
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
  meta?: SourceLocation
}

export function Branch(
  thenLabel: string,
  elseLabel: string,
  meta?: SourceLocation,
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
  meta?: SourceLocation
}

export function Goto(label: string, meta?: SourceLocation): Goto {
  return {
    kind: "Goto",
    label,
    meta,
  }
}

export type Return = {
  kind: "Return"
  exp: Exp
  meta?: SourceLocation
}

export function Return(exp: Exp, meta?: SourceLocation): Return {
  return {
    kind: "Return",
    exp,
    meta,
  }
}
