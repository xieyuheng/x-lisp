import { type Block } from "../block/index.ts"
import { type Data } from "../data/index.ts"
import { type Type } from "../type/index.ts"

export type Definition =
  | StructDefinition
  | FunctionDefinition
  | VariableDefinition
  | SetupDefinition
  | ExternFunctionDefinition
  | ExternVariableDefinition

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
  init: Data | null
}

export function VariableDefinition(
  name: string,
  init: Data | null,
): VariableDefinition {
  return { kind: "VariableDefinition", name, init }
}

export type SetupDefinition = {
  kind: "SetupDefinition"
  name: string
  blocks: Array<Block>
}

export function SetupDefinition(
  name: string,
  blocks: Array<Block>,
): SetupDefinition {
  return { kind: "SetupDefinition", name, blocks }
}

export type ExternFunctionDefinition = {
  kind: "ExternFunctionDefinition"
  name: string
}

export function ExternFunctionDefinition(
  name: string,
): ExternFunctionDefinition {
  return { kind: "ExternFunctionDefinition", name }
}

export type ExternVariableDefinition = {
  kind: "ExternVariableDefinition"
  name: string
}

export function ExternVariableDefinition(
  name: string,
): ExternVariableDefinition {
  return { kind: "ExternVariableDefinition", name }
}
