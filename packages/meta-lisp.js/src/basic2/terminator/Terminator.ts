import { type Operand } from "../operand/index.ts"

export type Terminator =
  | ReturnTerminator
  | GotoTerminator
  | BranchTerminator
  | TailCallTerminator
  | TailApplyTerminator
  | UnreachableTerminator

export type ReturnTerminator = {
  kind: "ReturnTerminator"
  value: Operand
}

export function ReturnTerminator(value: Operand): ReturnTerminator {
  return { kind: "ReturnTerminator", value }
}

export type GotoTerminator = {
  kind: "GotoTerminator"
  targetLabel: string
  args: Array<Operand>
}

export function GotoTerminator(
  targetLabel: string,
  args: Array<Operand>,
): GotoTerminator {
  return { kind: "GotoTerminator", targetLabel, args }
}

export type BranchTerminator = {
  kind: "BranchTerminator"
  condition: Operand
  thenLabel: string
  thenArgs: Array<Operand>
  elseLabel: string
  elseArgs: Array<Operand>
}

export function BranchTerminator(
  condition: Operand,
  thenLabel: string,
  thenArgs: Array<Operand>,
  elseLabel: string,
  elseArgs: Array<Operand>,
): BranchTerminator {
  return {
    kind: "BranchTerminator",
    condition,
    thenLabel,
    thenArgs,
    elseLabel,
    elseArgs,
  }
}

export type TailCallTerminator = {
  kind: "TailCallTerminator"
  target: Operand
  operands: Array<Operand>
}

export function TailCallTerminator(
  target: Operand,
  operands: Array<Operand>,
): TailCallTerminator {
  return { kind: "TailCallTerminator", target, operands }
}

export type TailApplyTerminator = {
  kind: "TailApplyTerminator"
  target: Operand
  operands: Array<Operand>
}

export function TailApplyTerminator(
  target: Operand,
  operands: Array<Operand>,
): TailApplyTerminator {
  return { kind: "TailApplyTerminator", target, operands }
}

export type UnreachableTerminator = {
  kind: "UnreachableTerminator"
}

export function UnreachableTerminator(): UnreachableTerminator {
  return { kind: "UnreachableTerminator" }
}
