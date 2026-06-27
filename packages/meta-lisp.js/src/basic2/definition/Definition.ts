import { type Type } from "../type/index.ts"
import { type Operand } from "../operand/index.ts"
import { type Block } from "../block/index.ts"

export type Definition =
  | StructDefinition
  | FunctionDefinition
  | VariableDefinition

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
  blocks: Array<Block>
}

export function FunctionDefinition(
  name: string,
  blocks: Array<Block>,
): FunctionDefinition {
  return { kind: "FunctionDefinition", name, blocks }
}

export type VariableDefinition = {
  kind: "VariableDefinition"
  name: string
  init: Operand | null
}

export function VariableDefinition(
  name: string,
  init: Operand | null,
): VariableDefinition {
  return { kind: "VariableDefinition", name, init }
}
