import { type Type } from "../type/index.ts"
import { type Operand } from "../operand/index.ts"
import { type Block } from "../block/index.ts"

export type Definition =
  | StructDefinition
  | FunctionDefinition
  | FunctionDeclaration
  | VariableDefinition
  | VariableDeclaration

export type StructDefinition = {
  kind: "StructDefinition"
  name: string
  fields: Record<string, Type>
}

export function StructDefinition(
  name: string,
  fields: Record<string, Type>,
): StructDefinition {
  return { kind: "StructDefinition", name, fields }
}

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  retType: Type
  blocks: Array<Block>
}

export function FunctionDefinition(
  name: string,
  retType: Type,
  blocks: Array<Block>,
): FunctionDefinition {
  return { kind: "FunctionDefinition", name, retType, blocks }
}

export type FunctionDeclaration = {
  kind: "FunctionDeclaration"
  name: string
  type: Type
}

export function FunctionDeclaration(
  name: string,
  type: Type,
): FunctionDeclaration {
  return { kind: "FunctionDeclaration", name, type }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  name: string
  type: Type
  init: Operand | null
}

export function VariableDefinition(
  name: string,
  type: Type,
  init: Operand | null,
): VariableDefinition {
  return { kind: "VariableDefinition", name, type, init }
}

export type VariableDeclaration = {
  kind: "VariableDeclaration"
  name: string
  type: Type
}

export function VariableDeclaration(
  name: string,
  type: Type,
): VariableDeclaration {
  return { kind: "VariableDeclaration", name, type }
}
