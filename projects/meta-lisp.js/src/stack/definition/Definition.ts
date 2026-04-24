import { type SourceLocation } from "@xieyuheng/sexp.js"
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
  location?: SourceLocation
}

export function PrimitiveFunctionDeclaration(
  name: string,
  arity: number,
  location?: SourceLocation,
): PrimitiveFunctionDeclaration {
  return {
    kind: "PrimitiveFunctionDeclaration",
    name,
    arity,
    location,
  }
}

export type PrimitiveVariableDeclaration = {
  kind: "PrimitiveVariableDeclaration"
  name: string
  location?: SourceLocation
}

export function PrimitiveVariableDeclaration(
  name: string,
  location?: SourceLocation,
): PrimitiveVariableDeclaration {
  return {
    kind: "PrimitiveVariableDeclaration",
    name,
    location,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  arity: number
  instrs: Array<Instr>
  location?: SourceLocation
}

export function FunctionDefinition(
  name: string,
  arity: number,
  instrs: Array<Instr>,
  location?: SourceLocation,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    arity,
    instrs,
    location,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  name: string
  instrs: Array<Instr>
  location?: SourceLocation
}

export function VariableDefinition(
  name: string,
  instrs: Array<Instr>,
  location?: SourceLocation,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    name,
    instrs,
    location,
  }
}

export type TestDefinition = {
  kind: "TestDefinition"
  name: string
  instrs: Array<Instr>
  location?: SourceLocation
}

export function TestDefinition(
  name: string,
  instrs: Array<Instr>,
  location?: SourceLocation,
): TestDefinition {
  return {
    kind: "TestDefinition",
    name,
    instrs,
    location,
  }
}
