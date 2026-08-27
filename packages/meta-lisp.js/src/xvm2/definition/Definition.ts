import { type Instr } from "../instr/index.ts"

export type Definition =
  | PrimitiveFunctionDeclaration
  | PrimitiveVariableDeclaration
  | VariableDeclaration
  | FunctionDefinition

export type PrimitiveFunctionDeclaration = {
  kind: "PrimitiveFunctionDeclaration"
  name: string
}

export function PrimitiveFunctionDeclaration(
  name: string,
): PrimitiveFunctionDeclaration {
  return {
    kind: "PrimitiveFunctionDeclaration",
    name,
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

export type VariableDeclaration = {
  kind: "VariableDeclaration"
  name: string
}

export function VariableDeclaration(name: string): VariableDeclaration {
  return {
    kind: "VariableDeclaration",
    name,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  parameters: Array<string>
  instrs: Array<Instr>
}

export function FunctionDefinition(
  name: string,
  parameters: Array<string>,
  instrs: Array<Instr>,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    parameters,
    instrs,
  }
}
