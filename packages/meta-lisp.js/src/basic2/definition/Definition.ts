import { type Block } from "../block/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Type } from "../type/index.ts"

export type Definition =
  StructDefinition | FunctionDefinition | VariableDefinition

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
  init: Exp | null
}

export function VariableDefinition(
  name: string,
  init: Exp | null,
): VariableDefinition {
  return { kind: "VariableDefinition", name, init }
}
