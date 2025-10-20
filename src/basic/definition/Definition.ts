import type { Block } from "../block/index.ts"

export type Definition = FunctionDefinition

export type FunctionDefinition = {
  kind: "FunctionDefinition"
  name: string
  parameters: Array<string>
  blocks: Map<string, Block>
}

export function FunctionDefinition(
  name: string,
  parameters: Array<string>,
  blocks: Map<string, Block>,
): FunctionDefinition {
  return {
    kind: "FunctionDefinition",
    name,
    parameters,
    blocks,
  }
}
