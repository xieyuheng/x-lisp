import { type Instr } from "../instr/index.ts"

export type Definition =
  | PrimitiveFunctionDeclaration
  | PrimitiveVariableDeclaration
  | FunctionDefinition
  | VariableDefinition
  | TestDefinition

export type PrimitiveFunctionDeclaration = {
  kind: "PrimitiveFunctionDeclaration"
  name: string
  arity: number
}

export function PrimitiveFunctionDeclaration(
  name: string,
  arity: number,
): PrimitiveFunctionDeclaration {
  return {
    kind: "PrimitiveFunctionDeclaration",
    name,
    arity,
  }
}

export type PrimitiveVariableDeclaration = {
  kind: "PrimitiveVariableDeclaration"
  name: string
}

export function PrimitiveVariableDeclaration(
  name: string,
): PrimitiveVariableDeclaration {
  return {
    kind: "PrimitiveVariableDeclaration",
    name,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  arity: number
  instrs: Array<Instr>
}

export function FunctionDefinition(
  name: string,
  arity: number,
  instrs: Array<Instr>,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    arity,
    instrs,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  name: string
  instrs: Array<Instr>
}

export function VariableDefinition(
  name: string,
  instrs: Array<Instr>,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    name,
    instrs,
  }
}

export type TestDefinition = {
  kind: "TestDefinition"
  name: string
  instrs: Array<Instr>
}

export function TestDefinition(
  name: string,
  instrs: Array<Instr>,
): TestDefinition {
  return {
    kind: "TestDefinition",
    name,
    instrs,
  }
}
