import { type SourceLocation } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition =
  | PrimitiveFunctionDeclaration
  | PrimitiveVariableDeclaration
  | FunctionDefinition
  | VariableDefinition
  | TestDefinition

export type PrimitiveFunctionDeclaration = {
  kind: "PrimitiveFunctionDeclaration"
  mod: Mod
  name: string
  arity: number
  location?: SourceLocation
}

export function PrimitiveFunctionDeclaration(
  mod: Mod,
  name: string,
  arity: number,
  location?: SourceLocation,
): PrimitiveFunctionDeclaration {
  return {
    kind: "PrimitiveFunctionDeclaration",
    mod,
    name,
    arity,
    location,
  }
}

export type PrimitiveVariableDeclaration = {
  kind: "PrimitiveVariableDeclaration"
  mod: Mod
  name: string
  location?: SourceLocation
}

export function PrimitiveVariableDeclaration(
  mod: Mod,
  name: string,
  location?: SourceLocation,
): PrimitiveVariableDeclaration {
  return {
    kind: "PrimitiveVariableDeclaration",
    mod,
    name,
    location,
  }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  mod: Mod
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
  location?: SourceLocation
}

export function FunctionDefinition(
  mod: Mod,
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
  location?: SourceLocation,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    mod,
    name,
    parameters,
    blocks,
    location,
  }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  location?: SourceLocation
}

export function VariableDefinition(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  location?: SourceLocation,
): VariableDefinition {
  return {
    kind: "VariableDefinition",
    mod,
    name,
    blocks,
    location,
  }
}

export type TestDefinition = {
  kind: "TestDefinition"
  mod: Mod
  name: string
  blocks: Map<string, Block>
  location?: SourceLocation
}

export function TestDefinition(
  mod: Mod,
  name: string,
  blocks: Map<string, Block>,
  location?: SourceLocation,
): TestDefinition {
  return {
    kind: "TestDefinition",
    mod,
    name,
    blocks,
    location,
  }
}
