import type { Exp } from "../exp/index.ts"
import { type SourceLocation } from "@xieyuheng/sexp.js"

export type Instr = Assign | Perform | Test | Branch | Goto | Return

export type Assign = {
  kind: "Assign"
  dest: string
  exp: Exp
  location?: SourceLocation
}

export function Assign(
  dest: string,
  exp: Exp,
  location?: SourceLocation,
): Assign {
  return {
    kind: "Assign",
    dest,
    exp,
    location,
  }
}

export type Perform = {
  kind: "Perform"
  exp: Exp
  location?: SourceLocation
}

export function Perform(exp: Exp, location?: SourceLocation): Perform {
  return {
    kind: "Perform",
    exp,
    location,
  }
}

export type Test = {
  kind: "Test"
  exp: Exp
  location?: SourceLocation
}

export function Test(exp: Exp, location?: SourceLocation): Test {
  return {
    kind: "Test",
    exp,
    location,
  }
}

export type Branch = {
  kind: "Branch"
  thenLabel: string
  elseLabel: string
  location?: SourceLocation
}

export function Branch(
  thenLabel: string,
  elseLabel: string,
  location?: SourceLocation,
): Branch {
  return {
    kind: "Branch",
    thenLabel,
    elseLabel,
    location,
  }
}

export type Goto = {
  kind: "Goto"
  label: string
  location?: SourceLocation
}

export function Goto(label: string, location?: SourceLocation): Goto {
  return {
    kind: "Goto",
    label,
    location,
  }
}

export type Return = {
  kind: "Return"
  exp: Exp
  location?: SourceLocation
}

export function Return(exp: Exp, location?: SourceLocation): Return {
  return {
    kind: "Return",
    exp,
    location,
  }
}
