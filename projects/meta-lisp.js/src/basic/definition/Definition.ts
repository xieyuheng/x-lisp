import { type SourceLocation } from "@xieyuheng/sexp.js"
import { type Block } from "../block/index.ts"
import type { Mod } from "../mod/index.ts"

export type Definition = FunctionDefinition | VariableDefinition

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
