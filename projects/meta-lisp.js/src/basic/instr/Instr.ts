import { type SourceLocation } from "@xieyuheng/sexp.js"
import type { Exp } from "../exp/index.ts"

export type Instr =
  | AssignInstr
  | PerformInstr
  | TestInstr
  | BranchInstr
  | GotoInstr
  | ReturnInstr

export type AssignInstr = {
  kind: "AssignInstr"
  dest: string
  exp: Exp
  location: SourceLocation
}

export function AssignInstr(
  dest: string,
  exp: Exp,
  location: SourceLocation,
): AssignInstr {
  return {
    kind: "AssignInstr",
    dest,
    exp,
    location,
  }
}

export type PerformInstr = {
  kind: "PerformInstr"
  exp: Exp
  location: SourceLocation
}

export function PerformInstr(exp: Exp, location: SourceLocation): PerformInstr {
  return {
    kind: "PerformInstr",
    exp,
    location,
  }
}

export type TestInstr = {
  kind: "TestInstr"
  exp: Exp
  location: SourceLocation
}

export function TestInstr(exp: Exp, location: SourceLocation): TestInstr {
  return {
    kind: "TestInstr",
    exp,
    location,
  }
}

export type BranchInstr = {
  kind: "BranchInstr"
  thenLabel: string
  elseLabel: string
  location: SourceLocation
}

export function BranchInstr(
  thenLabel: string,
  elseLabel: string,
  location: SourceLocation,
): BranchInstr {
  return {
    kind: "BranchInstr",
    thenLabel,
    elseLabel,
    location,
  }
}

export type GotoInstr = {
  kind: "GotoInstr"
  label: string
  location: SourceLocation
}

export function GotoInstr(label: string, location: SourceLocation): GotoInstr {
  return {
    kind: "GotoInstr",
    label,
    location,
  }
}

export type ReturnInstr = {
  kind: "ReturnInstr"
  exp: Exp
  location: SourceLocation
}

export function ReturnInstr(exp: Exp, location: SourceLocation): ReturnInstr {
  return {
    kind: "ReturnInstr",
    exp,
    location,
  }
}
